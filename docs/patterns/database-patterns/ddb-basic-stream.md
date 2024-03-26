---
sidebar_position: 1
title: DynamoDB Streams
description: Handle table changes with a Lambda
keywords: [rust,lambda,dynamodb,change data capture]
---

Serverless applications often use DynamoDB as their database technology.  DynamoDB handles tremendous scale, provides a simple yet powerful API, is 100% Serverless, and paired with the AWS SDK can be a key piece of an application.  DynamoDB can also serve as the starting point for a powerful architectual pattern called change data capture (CDC).  Change data capture is the process of propogating data changes so that other parts of the application can participate in those changes.  DynamoDB supports CDC by offering the capability called DynamoDB Streams.  Streams can be connected to a Lambda via a trigger or they can be connected to Kinesis.  This pattern below highlights how to handle CDC with DynamoDB via a Lambda trigger.

## Sample Solution

A template for this pattern can be found under the [./templates](https://github.com/jeastham1993/serverless-rust.github.io/tree/main/templates/patterns/database-patterns/ddb-stream-lambda-handler/) directory in the GitHub repo. You can use the template to get started building with DynamoDB Streams and Lambda.

The record structure that comes from DynamoDB is consistent depending upon the change type that you have configured.  For more details about the shape of the payload, [AWS' documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_Record.html) can describe the purpose of the fields and definitions.

Below are three main chunks of this sample solution.

1.  Main function
2.  Lambda handler code
3.  Parsing the record into a strongly typed struct.

Oh, this performs blazingly fast, because it's Rust.

### Main
<CH.Section>
Rust programs start off with a [`main`](focus://2) function.  The main function in this sample includes the [`Tokio`](focus://1) macro so that this main can run asynchronous code.

```rust
#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive(LevelFilter::INFO.into())
                .from_env_lossy(),
        )
        .json()
        .with_target(false)
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}
```
</CH.Section>

### Handler

<CH.Section>
The Lambda handler code is executed when events are received and is designed to process a batch of records.  The configuration on the DynamoDB Stream can be set to trigger the Lambda on 1 record or up to 100 records.  Either way, this will be packaged as an array. 


The first piece to note in this handler is that the event argument is typed to an [`event`](focus://1[26:87]).  This event uses the [Lambda events Crate](https://docs.rs/aws_lambda_events/latest/aws_lambda_events/) which defines the struct definition for the record definition specified by AWS. 

```rust
async fn function_handler(event: LambdaEvent<aws_lambda_events::event::dynamodb::Event>) -> Result<(), Error> {
    info!("(BatchSize)={:?}", event.payload.records.len());
    // Extract some useful information from the request
    for record in event.payload.records {
        let m: SampleModel = record.change.new_image.into();
        info!("(Sample)={:?}", m);
    }

    Ok(())
}
```

The second piece of this handler to highlight is the [`into()`](focus://5[53:59]) call on the new_image. This code converts the DynamoDB Stream Record into the [`SampleModel`](focus://5[14:26])
</CH.Section>

### SampleModel
<CH.Section>

One of the interesting things about table design when implementing CDC is that your any of your records will trigger the Lambda.  The more varied your items, the more varied your handler will have to be.  This needs to be taken into account when modeling your tables by either overloading keys in a single table design vs using multiple tables to represent your entities.  There's no right or wrong, just what is right for your needs.

For the purposes of this sample, the sample model is defined like this.

```rust
#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SampleModel {
    id: i32,
    message: String,
    entity_type: String
}
```

The model includes the [`Serialize, Deserialie, and Debug macros`](focus://1) which support taking the struct in and out of JSON.

This struct then implements the `into` trait in order to provide conversion from the DynamoDB Record into this SampleModel struct.

```rust
impl From<serde_dynamo::Item> for SampleModel {
    fn from(value: Item) -> Self {

        let id_attr = value.get("Id");
        let message_attr: Option<&AttributeValue> = value.get("Message");
        let entity_type_attr: Option<&AttributeValue> = value.get("EntityType");
        let mut id = 0;
        let mut message = String::new();
        let mut entity_type = String::new();

        if let Some(AttributeValue::N(n)) = id_attr {
            if let Ok(i) = n.parse::<i32>() {
                id = i;
            }
        }

        if let Some(AttributeValue::S(s)) = entity_type_attr {
            entity_type = s.clone();
        }

        if let Some(AttributeValue::S(s)) = message_attr {
            message = s.clone();
        }

        SampleModel {
            id,
            message,
            entity_type
        }
    }
}
```
</CH.Section>

## Wrapping up

This sample shows a basic implementation of handling an array of DynamoDB Stream Records and how to convert them into a well defined struct.  From this point, the options are endless.

## Congrats

Congratulations, you know have a starting point to build your Rust Lambdas for processing DynamoDB Change Data Capture Records!
