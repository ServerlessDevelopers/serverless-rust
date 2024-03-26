---
sidebar_position: 4
title: SQS Message Processor
description: Lambda function for processing messages from an SQS queue
keywords: [rust,lambda,sqs,messaging,point to point channels]
---

Queueing is a vital part of almost every serverless system. The ability to pass messages between different services gives you looser coupling whilst providing an element of durability of messages in flight. Queues are an example of a point to point integration pattern. Typically a 1:1 relationship between the producer of the message and the consumer of the message.

Amazon Simple Queue Service (SQS) was the first AWS service ever released (it's a close fought thing with SQS and Amazon S3), all the way back in 2007. If you're looking to introduce queueing to your system, using SQS, Rust and AWS Lambda then this is the article for you.

## How It Works

The SQS to Lambda integration is an example of a [poll based invoke](../../fundamentals/invocation-modes.md#poll-based-invokes). Internally, the Lambda service polls the SQS queue on your behalf and invokes your Lambda function with a batch of messages. The size of the message batch can be configured as part of the Lambda event source. As a developer, that means you need to write your Lambda functions to handle a batch of messages.

## Project Structure

A SQS to Lambda template is found under the [./templates](https://github.com/jeastham1993/serverless-rust.github.io/tree/main/templates/patterns/messaging-patterns/sqs-message-processor) directory in the GitHub repo. You can use template to get started building with SQS and Lambda.

The project separates the SQS handling code from your business logic. This allows you to share domain code between multiple Lambda functions that are contained within the same service.

```bash
lambdas
  - new-message-processor
  - shared
```

This tutorial will mostly focus on the code under `lambdas/new-message-processor`. Although shared code will be referenced to discuss how you can take this template and 'plug-in' your own implementation.

## Lambda Code

<CH.Section>

Whenever you are working with SQS and Lambda your [`main`](focus://2[10:14]) function will look the same. This example doesn't focus on initializing AWS SDK's or reusable code. However, inside the main method is where you would normally initialize anything that is re-used between invokes.

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

It's worth noting, that this [`main`](focus://2[10:14]) function example would work for almost all Lambda Event Sources. The difference coming when moving on to the function_handler itself.

</CH.Section>

<CH.Scrollycoding>

The main bulk of an SQS sourced Lambda function is implemented in the [`function_handler`](focus://1[10:25]) function. The first piece to note in this handler is that the event argument is typed to an [`event`](focus://1[26:54]). This event uses the [Lambda events Crate](https://docs.rs/aws_lambda_events/latest/aws_lambda_events/) which defines the struct definition for the record definition specified by AWS. As you are sourcing your function with SQS, this uses the `SqsEvent` type.


```rust
async fn function_handler(event: LambdaEvent<SqsEvent>)
    -> Result<SqsBatchResponse, Error> {
    let mut batch_item_failures = Vec::new();

    for message in event.payload.records {

    }

    Ok(SqsBatchResponse{
        batch_item_failures
    })
}
```

---

As you learned earlier, Lambda receives your SQS messages in batches. When your function completes successfully, Lambda then deletes all the messages from that batch from the SQS queue. If your function errors, then the messages return to the queue. However, Lambda also supports the ability to return partial successes. For example, if your function receives 10 messages and 9 complete you can tell Lambda to delete 9 from the queue and return 1 for re-processing. You do that, using the [`SqsBatchResponse`](focus://2[15:30]). The SQS Batch response contains a single property named [`batch_item_failures`](focus://9:11) which is a Vector of the failed message_ids.


```rust
async fn function_handler(event: LambdaEvent<SqsEvent>)
    -> Result<SqsBatchResponse, Error> {
    let mut batch_item_failures = Vec::new();

    for message in event.payload.records {

    }

    Ok(SqsBatchResponse{
        batch_item_failures
    })
}
```

---

Inside the for loop, you can handle individual messages. For re-usability, a custom [`InternalSqsMessage`](focus://9) struct is used as a wrapper around the `SqsMessage` type that comes from the [Lambda events Crate](https://docs.rs/aws_lambda_events/latest/aws_lambda_events/). This allows the [`try_into()`](focus://9) function to be used to handle the conversion from the custom SQS type into the `NewMessage` type used by the application.

You'll notice that if a failure occurs either in the [initial message parsing](focus://9) or the actual [handling of the message](focus://19) a new `BatchItemFailure` is pushed onto the `batch_item_failures` that are returned. This allows you to support partial completions in your SQS sourced Lambda functions.

```rust
async fn function_handler(event: LambdaEvent<SqsEvent>) 
    -> Result<SqsBatchResponse, Error> {
    let mut batch_item_failures = Vec::new();

    for message in event.payload.records {
        let message_id = message.message_id.clone().unwrap_or("".to_string());

        let new_message: Result<NewMessage, MessageParseError> 
            = InternalSqsMessage::new(message.clone()).try_into();

        if new_message.is_err() {
            batch_item_failures.push(BatchItemFailure{
                item_identifier: message_id
            });
            continue;
        }

        // Business logic goes here
        let handle_result = NewMessageHandler::handle(&new_message.unwrap()).await;

        if handle_result.is_err() {
            batch_item_failures.push(BatchItemFailure{
                item_identifier: message_id
            });
            continue;
        }
    }

    Ok(SqsBatchResponse{
        batch_item_failures
    })
}
```

</CH.Scrollycoding>


## Shared Code & Reusability

<CH.Section>

The shared code in this example contains a custom [`NewMessage`](focus://1:5) struct representing the actual message payload passed through SQS. The shared code also contains a [`NewMessageHandler`](focus://7) that contains a [`handle` function](focus://10:14), taking the `NewMessage` struct as a input parameter.

If you want to use this template in your own applications, replace the [`NewMessage`](focus://1:5) struct with your own custom struct and update the [`handle` function](focus://10:14) with your custom business logic.

```rust lib.rs
#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewMessage {
    pub order_id: String
}

pub struct NewMessageHandler {}

impl NewMessageHandler {
    pub async fn handle(message: &NewMessage) -> Result<(), ()> {
        tracing::info!("New message is for {}", message.order_id);
        // Business logic goes here
        Ok(())
    }
}
```

</CH.Section>

<CH.Section>

The shared library also contains code to convert an `SqsMessage` into the custom `NewMessage` struct. It does this using the [`TryFrom` trait](focus://13). Because the `SqsMessage` struct is defined in an external crate, the [`InternalSqsMessage` struct](focus://1:3) is used as a wrapper. Traits cannot be implemented for structs outside of the current crate.

You'll notice the [`try_from`](focus://16:15) function returns a custom `MessageParseError` type depending if the message body is empty or the message fails to deserialize correctly.

```rust lib.rs
pub struct InternalSqsMessage{
    message: SqsMessage
}

impl InternalSqsMessage{
    pub fn new(message: SqsMessage) -> Self {
        Self {
            message
        }
    }
}

impl TryFrom<InternalSqsMessage> for NewMessage {
    type Error = MessageParseError;

    fn try_from(value: InternalSqsMessage) -> Result<Self, Self::Error> {
        match value.message.body {
            None => Err(MessageParseError::EmptyMessageBody),
            Some(body) => {
                let parsed_body: NewMessage = serde_json::from_str(body.as_str())?;

                Ok(parsed_body)
            }
        }
    }
}

```

</CH.Section>

Congratulations, you now know how to implement an SQS sourced Lambda function in Rust and do that in a way that separates your Lambda handling code from your business logic.

You've also learned how you can use the `SqsBatchResponse` struct to handle partial completions inside your message processing logic.

## Deploy Your Own

If you want to deploy this exact example, clone the GitHub repo and run the below commands:

```bash deploy.sh
cd templates/patterns/messaging-patterns/sqs-message-processor
sam build

```

You can then invoke the function using the below CLI command, replacing the `<QUEUE_URL>` with the URL that was output as part of the `sam deploy` step. The `sam logs` command will grab the latest logs.

```bash test.sh
aws sqs send-message --queue-url <QUEUE_URL> --message-body '{"orderId":"Hello"}'
sam logs
```