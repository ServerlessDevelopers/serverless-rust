---
sidebar_position: 2
title: Kinesis Message Processor
description: Lambda function for processing messages from a Kinesis stream
keywords: [rust,lambda,kinesis,messaging,streaming data]
---

With the explosion of data streaming, whether that be readings from IoT sensors or events in an event driven architectures, the amount of data moving around in your organisation is probably increasing. As this volume continues to grow, your ability to process records from the stream quickly and efficiently is going to have a direct impact on the cost and scalability of your system.

Amazon Kinesis is a serverless streaming service provided by AWS. It allows producers to put messages onto the stream and services like AWS Lambda and Amazon Event Bridge Pipes can be added as consumers of records on the stream.

## How It Works

The Kinesis to Lambda integration is an example of a [poll based invoke](../../fundamentals/invocation-modes.md#poll-based-invokes). Internally, the Lambda service polls the Kinesis stream on your behalf and invokes your Lambda function with a batch of messages. As a developer, that means you need to write your Lambda functions to handle a batch of messages.

This integration ensures you, as a developer, don't need to worry about the last read location of the stream. And the Lambda Event Source supports partial completions. Meaning if only 10 of the 20 messages in the current batch are processed successfully, the stream location will not move forward.

## Project Structure

A Kinesis to Lambda template is found under the [./templates](https://github.com/jeastham1993/serverless-rust.github.io/templates/patterns/messaging-patterns/kinesis-message-processor) directory in the GitHub repo. You can use template to get started building with SQS and Lambda.

The project separates the Kinesis processing code from your business logic. This allows you to share domain code between multiple Lambda functions that are contained within the same service.

```bash
lambdas
  - new-message-processor
  - shared
```

This tutorial will mostly focus on the code under `lambdas/new-message-processor`. Although shared code will be referenced to discuss how you can take this template and 'plug-in' your own implementation.

## Lambda Code

<CH.Section>

Whenever you are working with Kinesis and Lambda your [`main`](focus://2[10:14]) function will look the same. This example doesn't focus on initializing AWS SDK's or reusable code. However, inside the main method is where you would normally initialize anything that is re-used between invokes.

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

One thing to note is the [`tokio::main`](focus://1[3:13]) macro.  Macros in Rust are signals to the compiler to generate some code based upon the macros' definition. The tokio macro allows the [`main`](focus://2[10:14]) function to run asynchronous, which is what the Lambda handler function requires.

It's worth noting, that this [`main`](focus://2[10:14]) function example would work for almost all Lambda Event Sources. The difference coming when moving on to the function_handler itself.

</CH.Section>

<CH.Scrollycoding>

The main bulk of a Kinesis sourced Lambda function is implemented in the [`function_handler`](focus://1[10:25]) function. The first piece to note in this handler is that the event argument is typed to an [`event`](focus://1[26:57]). This event uses the [Lambda events Crate](https://docs.rs/aws_lambda_events/latest/aws_lambda_events/) which defines the struct definition for the record definition specified by AWS. As you are sourcing your function with SQS, this uses the `Kinesis Event` type.


```rust
async fn function_handler(event: LambdaEvent<KinesisEvent>) -> Result<KinesisEventResponse, Error> {
    
    Ok(KinesisEventResponse{
        batch_item_failures,
    })
}
```

---

As you learned earlier, Lambda receives messages from Kinesis in batches. When your function completes successfully, Lambda then deletes all the messages from that batch from the SQS queue. If your function errors, then the messages return to the queue. However, Lambda also supports the ability to return partial successes. For example, if your function receives 50 messages and 48 complete the position in the stream will move forward to the last successfully processed message. You do that, using the [`KinesisEventResponse`](focus://2[15:36]). The `KinesisEventResponse` contains a single property named [`batch_item_failures`](focus://19:21) which is a Vector of the failed sequence numbers.


```rust
async fn function_handler(event: LambdaEvent<KinesisEvent>)
    -> Result<KinesisEventResponse, Error> {
    let mut batch_item_failures = Vec::new();

    for message in &event.payload.records {
        let kinesis_sequence_number = message.kinesis.sequence_number.clone();

        let new_message: Result<NewSensorReading, MessageParseError> = InternalKinesisMessage::new(message.clone()).try_into();

        if new_message.is_err() {
            batch_item_failures.push(KinesisBatchItemFailure{
                item_identifier: kinesis_sequence_number
            });
            continue;
        }
    }

    Ok(KinesisEventResponse{
        batch_item_failures,
    })
}
```

---

Inside the for loop, you can handle individual messages. For re-usability, a custom [`InternalKinesisMessage`](focus://8) struct is used as a wrapper around the `SqsMessage` type that comes from the [Lambda events Crate](https://docs.rs/aws_lambda_events/latest/aws_lambda_events/). This allows the [`try_into()`](focus://8) function to be used to handle the conversion from the custom `KinesisEventRecord` type into the `NewSensorReading` custom to your application.

You'll notice that if a failure occurs either in the [initial message parsing](focus://10) or the actual [handling of the message](focus://20) a new `KinesisBatchItemFailure` is pushed onto the `batch_item_failures` vector. This allows you to support partial completions in your Kinesis sourced Lambda functions.

```rust
async fn function_handler(event: LambdaEvent<KinesisEvent>) -> Result<KinesisEventResponse, Error> {
    let mut batch_item_failures = Vec::new();

    for message in &event.payload.records {
        let kinesis_sequence_number = message.kinesis.sequence_number.clone();

        let new_message: Result<NewSensorReading, MessageParseError> 
            = InternalKinesisMessage::new(message.clone()).try_into();

        if new_message.is_err() {
            batch_item_failures.push(KinesisBatchItemFailure{
                item_identifier: kinesis_sequence_number
            });
            continue;
        }

        // Business logic goes here
        let handle_result = NewSensorReadingHandler::handle(&new_message.unwrap()).await;

        if handle_result.is_err() {
            batch_item_failures.push(KinesisBatchItemFailure{
                item_identifier: kinesis_sequence_number
            });
            continue;
        }
    }

    Ok(KinesisEventResponse{
        batch_item_failures,
    })
}
```

</CH.Scrollycoding>


## Shared Code & Reusability

<CH.Section>

The shared code in this example contains a custom [`NewSensorReading`](focus://1:5) struct representing the actual message put onto the stream. The shared code also contains a [`NewSensorReadingHandler`](focus://8) that contains a [`handle` function](focus://11:18), taking the `NewSensorReading` struct as a input parameter.

If you want to use this template in your own applications, replace the [`NewSensorReading`](focus://1:5) struct with your own custom struct and update the [`handle` function](focus://11:18) with your custom business logic.

```rust lib.rs
#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewSensorReading {
    pub temperature: f64,
    pub reading_timestamp: i64
}

pub struct NewSensorReadingHandler {}

impl NewSensorReadingHandler {
    pub async fn handle(message: &NewSensorReading) -> Result<(), ()> {
        tracing::info!("New message is for temperature {} at time {}", message.temperature, message.reading_timestamp);

        if message.temperature > 100.00 {
            return Err(());
        }

        Ok(())
    }
}
```

</CH.Section>

<CH.Section>

The shared library also contains code to convert a `KinesisEventRecord` into the custom `NewSensorReading` struct. It does this using the [`TryFrom` trait](focus://13). Because the `KinesisEventRecord` struct is defined in an external crate, the [`InternalKinesisMessage` struct](focus://1:3) is used as a wrapper. Traits cannot be implemented for structs outside of the current crate.

The actual contents of the record passed to your Lambda function is Base64 encoded. The [`serde_json::from_slice` function is used to deserialize the payload directly into the custom `NewSensorReading` type](focus://18)

You'll notice the [`try_from`](focus://16:15) function returns a custom `MessageParseError` type depending if the message body is empty or the message fails to deserialize correctly.

```rust lib.rs
pub struct InternalKinesisMessage{
    message: KinesisEventRecord
}

impl InternalKinesisMessage{
    pub fn new(message: KinesisEventRecord) -> Self {
        Self {
            message
        }
    }
}

impl TryFrom<InternalKinesisMessage> for NewSensorReading {
    type Error = MessageParseError;

    fn try_from(value: InternalKinesisMessage) -> Result<Self, Self::Error> {
        let parsed_body: NewSensorReading 
            = serde_json::from_slice(value.message.kinesis.data.0.as_slice())?;

        Ok(parsed_body)
    }
}

```

</CH.Section>

Congratulations, you now know how to implement a Kinesis sourced Lambda function in Rust and do that in a way that separates your Lambda handling code from your business logic.

You've also learned how you can use the `KinesisEventResponse` struct to handle partial completions inside your message processing logic.

## Deploy Your Own

If you want to deploy this exact example, clone the GitHub repo and run the below commands:

```bash deploy.sh
cd templates/patterns/messaging-patterns/kinesis-message-processor
sam build
sam deploy
```

You can then invoke the function using the below CLI command, replacing the `<STREAM_ARN>` with the URL that was output as part of the `sam deploy` step. The `sam logs` command will grab the latest logs.

```bash test.sh
aws kinesis put-record --data "eyJ0ZW1wZXJhdHVyZSI6IDg5LjksICJyZWFkaW5nVGltZXN0YW1wIjogODkyMzc0MiB9" --partition-key "sensor-1" --region eu-west-1 --profile dev --stream-arn <STREAM_ARN>
sam logs
```