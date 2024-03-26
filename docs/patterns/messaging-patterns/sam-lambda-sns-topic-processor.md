---
sidebar_position: 3
title: SNS Message Processor
description: Lambda function for processing messages from an SNS topic
keywords: [rust,lambda,sns,messaging,publish subscribe channels]
---

Publish/subscribe (pub/sub) is one of the two fundamental integration patterns in messaging (the other being point-to-point). In a pub/sub integration a producer *publishes* a message onto a channel, and a subscriber receives that message. The channel in the middle could be an event bus, a topic or a stream. This pattern focuses on topic based publish subscribe.

A topic is a message channel typically focused on a specific type of message. You may have **order-created** and **order-updated** channels. This differs from an event bus where you typically have a single bus with different types of events flowing through the same channel.

Amazon Simple Notification Service (SNS) is an example of how you can implement topic based publish/subscribe using AWS services. If you're looking to introduce pub/sub to your system, using SNS, Rust and AWS Lambda then this is the article for you.

## How It Works

The SNS to Lambda integration is an example of an [async invoke](../../fundamentals/invocation-modes.md#asynchronous-invokes). The SNS service calls the [InvokeAsync](https://docs.aws.amazon.com/lambda/latest/api/API_InvokeAsync.html) API on the Lambda service passing the message payload. Internally, the Lambda service queues up these messages and invokes your function.

It's important to remember that SNS itself is ephemeral and provides no durability guarantees.

## Project Structure

A SNS to Lambda template is found under the [./templates](https://github.com/jeastham1993/serverless-rust.github.io/tree/main/templates/patterns/messaging-patterns/sns-message-processor) directory in the GitHub repo. You can use template to get started building with SNS and Lambda.

The project separates the SNS/Lambda handling code from your business logic. This allows you to share domain code between multiple Lambda functions that are contained within the same service.

```bash
lambdas
  - new-message-processor
  - shared
```

This tutorial will mostly focus on the code under `lambdas/new-message-processor`. Although shared code will be referenced to discuss how you can take this template and 'plug-in' your own implementation.

## Lambda Code

<CH.Section>

Whenever you are working with SNS and Lambda your [`main`](focus://2[10:14]) function will look the same. This example doesn't focus on initializing AWS SDK's or reusable code. However, inside the main method is where you would normally initialize anything that is re-used between invokes.

```rust
#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}
 ```

One thing to note is the [`tokio macro`](focus://1[3:13]) macro.  Macros in Rust are signals to the compiler to generate some code based upon the macros' definition. The tokio macro allows the [`main`](focus://2[10:14]) function to run asynchronous, which is what the Lambda handler function requires.

It's worth noting, that this [`main`](focus://2[10:14]) function example would work for almost all Lambda Event Sources. The difference coming when moving on to the `function_handler` itself.

</CH.Section>

<CH.Scrollycoding>

The main bulk of an SNS sourced Lambda function is implemented in the [`function_handler`](focus://1[10:25]) function. The first piece to note in this handler is that the event argument is typed to an [`event`](focus://1[26:54]). This event uses the [Lambda events Crate](https://docs.rs/aws_lambda_events/latest/aws_lambda_events/) which defines the struct definition for the record definition specified by AWS. As you are sourcing your function with SNS, this uses the `SnsEvent` type.


```rust
async fn function_handler(event: LambdaEvent<SnsEvent>) -> Result<(), String> {
    for message in &event.payload.records {
        let new_message: Result<OrderCreatedMessage, MessageParseError>
            = InternalSnsMessage::new(message.clone()).try_into();

        if new_message.is_err(){
            return Err("Failure deserializing message body".to_string());
        }

        let _ = OrderCreatedMessageHandler::handle(&new_message.unwrap()).await?;
    }

    Ok(())
}
```

---

As you learned earlier, SNS invokes your Lambda function using the `InvokeAsync` API call. This means SNS can continue doing other work and the Lambda service can invoke your function asynchronously. The `SnsEvent` struct, contains a vector of `SnsRecords`. However, this vector will only ever contain a single message. For re-usability, a custom [`InternalSnsMessage`](focus://4) struct is used as a wrapper around the `SnsRecord` type that comes from the [Lambda events Crate](https://docs.rs/aws_lambda_events/latest/aws_lambda_events/). This allows the [`try_into()`](focus://4) function to be used to handle the conversion from the custom SNS type into the `OrderCreatedMessage` type used by the application.

You'll notice that if a failure occurs either in the [initial message parsing](focus://4) or the actual [handling of the message](focus://10) an error is returned. This ensures an error is passed back up to the Lambda service and retries can happen.

```rust
async fn function_handler(event: LambdaEvent<SnsEvent>) -> Result<(), String> {
    for message in &event.payload.records {
        let new_message: Result<OrderCreatedMessage, MessageParseError>
            = InternalSnsMessage::new(message.clone()).try_into();

        if new_message.is_err(){
            return Err("Failure deserializing message body".to_string());
        }

        let _ = OrderCreatedMessageHandler::handle(&new_message.unwrap()).await?;
    }

    Ok(())
}
```

</CH.Scrollycoding>


## Shared Code & Reusability

<CH.Section>

The shared code in this example contains a custom [`OrderCreatedMessage`](focus://6:10) struct representing the actual message payload that was published. The shared code also contains a [`OrderCreatedMessageHandler`](focus://12) that contains a [`handle` function](focus://15:23), taking the `OrderCreatedMessage` struct as a input parameter.

If you want to use this template in your own applications, replace the [`OrderCreatedMessage`](focus://6:10) struct with your own custom struct and update the [`handle` function](focus://15:23) with your custom business logic.

```rust lib.rs
#[derive(Debug)]
pub enum OrderCreatedMessageHandleError{
    UnexpectedError
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct OrderCreatedMessage {
    pub order_id: String
}

pub struct OrderCreatedMessageHandler {}

impl OrderCreatedMessageHandler {
    pub async fn handle(message: &OrderCreatedMessage) -> Result<(), OrderCreatedMessageHandleError> {
        tracing::info!("New message is for {}", message.order_id);

        if message.order_id == "error" {
            return Err(OrderCreatedMessageHandleError::UnexpectedError);
        }

        Ok(())
    }
}
```

</CH.Section>

<CH.Section>

The shared library also contains code to convert an `SnsRecord` into the custom `OrderCreatedMessage` struct. It does this using the [`TryFrom` trait](focus://13). Because the `SnsRecord` struct is defined in an external crate, the [`InternalSnsMessage` struct](focus://1:3) is used as a wrapper. Traits cannot be implemented for structs outside of the current crate.

You'll notice the [`try_from`](focus://16:15) function returns a custom `MessageParseError` type depending if the message body is empty or the message fails to deserialize correctly.

```rust lib.rs
pub struct InternalSnsMessage{
    message: SnsRecord
}

impl InternalSnsMessage{
    pub fn new(message: SnsRecord) -> Self {
        Self {
            message
        }
    }
}

impl TryFrom<InternalSnsMessage> for OrderCreatedMessage {
    type Error = MessageParseError;

    fn try_from(value: InternalSnsMessage) -> Result<Self, Self::Error> {
        let parsed_body: OrderCreatedMessage = serde_json::from_str(value.message.sns.message.as_str())?;

        Ok(parsed_body)
    }
}

```

</CH.Section>

Congratulations, you now know how to implement an SNS sourced Lambda function in Rust and do that in a way that separates your Lambda handling code from your business logic.

## Deploy Your Own

If you want to deploy this exact example, clone the GitHub repo and run the below commands:

```bash deploy.sh
cd templates/patterns/messaging-patterns/sns-message-processor
sam build
sam deploy

```

You can then invoke the function using the below CLI command, replacing the `<TOPIC_ARN>` with the ARN that was output as part of the `sam deploy` step. The `sam logs` command will grab the latest logs.

```bash test.sh
aws sns publish --message '{"orderId":"1234"}' --region eu-west-1 --profile dev --topic-arn <TOPIC_ARN>
sam logs
```

If you run the below command, you can test failure scenarios. In this example, the Lambda function uses a [OnFailure Destination](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-destinations/) to route failed invokes to an SQS queue.

```bash failure-test.sh
aws sns publish --message '{"orderId":"error"}' --region eu-west-1 --profile dev --topic-arn <TOPIC_ARN>
sam logs
```