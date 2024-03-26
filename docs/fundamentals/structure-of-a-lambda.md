---
sidebar_position: 2
title: Structure of a Lambda function
description: A walkthrough of the key components of a Lambda function.
keywords: [fundamentals]
---

# Lambda Function Structure

Let's discuss the structure of a Lambda function built using Rust. We will dive deeper into these topics in later sections.


<CH.Scrollycoding>


## (De)serialization

Event payloads are passed to Lambda functions as JSON strings. The Lambda runtime for Rust supports the ability to automatically (de)serialize the Lambda payloads and responses on your behalf.

```rust main.rs focus=22
use lambda_runtime::{service_fn, tracing, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use aws_sdk_dynamodb::{types::AttributeValue, Client};

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();

    let config = aws_config::load_from_env().await;
    let table_name = env::var("TABLE_NAME").expect("TABLE_NAME must be set");
    let dynamodb_client = Client::new(&config);

    lambda_runtime::run(service_fn(|request: LambdaEvent<Request>| {
        let res = function_handler(request, &dynamodb_client).await;

        res
    }

    Ok(())
}

pub(crate) async fn function_handler(event: LambdaEvent<Request>, client: &Client) -> Result<Response, Error> {
    let command = event.payload.input_property;

    let resp = Response {
        response_id: event.context.request_id,
    };

    Ok(resp)
}
```
---

## Initialization

The _`function_handler`_ method will be called on every invoke. It's a good practice in Lambda to initialize any objects that can be re-used outside of the handler. Things like database connections, configuration or loading of any static data.

Performing this once outside of the handler ensures this code will only execute once per execution environment. In this example, we are initializing the DynamoDB SDK _`Client`_ object in the main function.

```rust main.rs focus=8:10
use lambda_runtime::{service_fn, tracing, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use aws_sdk_dynamodb::{types::AttributeValue, Client};

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();

    let config = aws_config::load_from_env().await;
    let table_name = env::var("TABLE_NAME").expect("TABLE_NAME must be set");
    let dynamodb_client = Client::new(&config);

    lambda_runtime::run(service_fn(|request: LambdaEvent<Request>| {
        let res = function_handler(request, &dynamodb_client).await;

        res
    }

    Ok(())
}

pub(crate) async fn function_handler(event: LambdaEvent<Request>, client: &Client) -> Result<Response, Error> {
    let command = event.payload.input_property;

    let resp = Response {
        response_id: event.context.request_id,
    };

    Ok(resp)
}
```
---

## The Event Payload

The `LambdaEvent` struct used by your `function_handler` is what the Lambda Rust runtime parses on your behalf. It is a combination of the Event payload passed to Lambda, and the Lambda context. The structure of this payload will change depending if you are using API Gateway, SQS or any of the other Lambda event sources.

In this example, the Lambda function is being triggered by a custom invoke with a custom input object. In the `function_handler`, you can access the actual input payload using the `payload` property.

```rust main.rs focus=23
use lambda_runtime::{service_fn, tracing, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use aws_sdk_dynamodb::{types::AttributeValue, Client};

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();

    let config = aws_config::load_from_env().await;
    let table_name = env::var("TABLE_NAME").expect("TABLE_NAME must be set");
    let dynamodb_client = Client::new(&config);

    lambda_runtime::run(service_fn(|request: LambdaEvent<Request>| {
        let res = function_handler(request, &dynamodb_client).await;

        res
    }

    Ok(())
}

pub(crate) async fn function_handler(event: LambdaEvent<Request>, client: &Client) -> Result<Response, Error> {
    let command = event.payload.input_property;

    let resp = Response {
        response_id: event.context.request_id,
    };

    Ok(resp)
}
```
---

## The Lambda Context

The `LambdaEvent` struct has a second property named `context`. This property contains **contextual** information about this specific invoke of the function.

```rust main.rs focus=26
use lambda_runtime::{service_fn, tracing, Error, LambdaEvent};
use serde::{Deserialize, Serialize};
use aws_sdk_dynamodb::{types::AttributeValue, Client};

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();

    let config = aws_config::load_from_env().await;
    let table_name = env::var("TABLE_NAME").expect("TABLE_NAME must be set");
    let dynamodb_client = Client::new(&config);

    lambda_runtime::run(service_fn(|request: LambdaEvent<Request>| {
        let res = function_handler(request, &dynamodb_client).await;

        res
    }

    Ok(())
}

pub(crate) async fn function_handler(event: LambdaEvent<Request>, client: &Client) -> Result<Response, Error> {
    let command = event.payload.input_property;

    let resp = Response {
        response_id: event.context.request_id,
    };

    Ok(resp)
}
```


</CH.Scrollycoding>