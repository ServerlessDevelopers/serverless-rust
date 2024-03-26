---
sidebar_position: 1
title: EventBridge PutEvent
description: Lambda function for sending a PutEvent to an EventBus
keywords: [rust,lambda,eventbridge,messaging,putevent]
---

As mentioned in several of the other messaging quick starts, the publisher/subscriber (pub/sub) pattern is extremely common in a serverless architecture. Severless encourages micro and someties even nano-sized components that are assembled together by way of contracts as opposed to building everything into a single binary.

AWS' EventBridge is a service that describes itself like this:

> Amazon EventBridge Event Bus is a serverless event bus that helps you receive, filter, transform, route, and deliver events. - AWS

It provides a Default Bus or you are able to add Custom Event Buses to fit your need.  This article will look to showcase how to create an EventBridge Bus Producer.

## How It Works

The sample in this tutorial builds upon a Lambda that listens on a Function URL and then generates an EventBridge PutEvent with a custom domain model.  The heart of this is really explaining how to generate a payload for EventBridge and operating the AWS SDK for Rust.  The triggering event could be an API request, an SQS poll, or any of the other event triggers that Lambda can handle.

## Project Structure

A Lambda and EventBridge PutEvent template is found under the [./templates](https://github.com/jeastham1993/serverless-rust.github.io/tree/main/templates/patterns/messaging-patterns/eventbridge-putevent) directory in the GitHub repo. You can use template to get started building with EventBridge and Lambda.

The template is simple, and is based upon the following structure.

```bash
lambdas
  - handler
  - shared
```

## Lambda Code

### Main 

<CH.Section>

When working with EventBridge and Lambda, an SDK Client much be initialized in the [`main`](focus://2[10:14]) function.  A solid pattern is to read the [`EVENT_BUS_NAME`](focus://13[30:43]) from the environment so that it can be easily changed without a redploy.  Another part of the main function's responsibilities is to establish an SDK reference to the EventBridge client.  By passing the shared client reference into the [`function_handler`](focus://16[8:24]), your Lambda will run effeciently request after request.

```rust
#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    let config = aws_config::load_from_env().await;
    let client = aws_sdk_eventbridge::Client::new(&config);
    let shared_client: &aws_sdk_eventbridge::Client = &client;

    let bus_name = env::var("EVENT_BUS_NAME").expect("EVENT_BUS_NAME must be set");
    let cloned_bus_name = &bus_name.as_str();
    run(service_fn(move |payload: Request| async move {
        function_handler(cloned_bus_name, shared_client, payload).await
    }))
        .await

}
```

</CH.Section>


### Handler Code

<CH.Section>
The handler code in this sample is processing events from a Function URL that passes an API event into the Lambda.  Instead of focusing on that part of the handler, let's have a look at the EventBridge specific code.

If the payload is able to be matched, then [`send_to_event_bridge`](focus://2[26:45]) is called with the shared client, the payload, and the bus_name.

```rust
match payload {
    Ok(payload) => match send_to_event_bridge(client, &payload, bus_name).await {
        Ok(_) => info!("Successfully posted to EventBridge"),
        Err(_) => {
            status_code = 400;
            response_body = "Bad Request";
        }
    },
    Err(_) => {
        status_code = 400;
        response_body = "Bad Request";
    }
}
{}
```
</CH.Section>

<CH.Section>

The send_to_event_bridge function handles building the EventBridge request and executing the PutEvent.  Pay close attention to the structure of your events and then notice that the client is executing a [`put_events`](focus://14[12:21]) which will supply multiple entries to EventBridge

```rust
async fn send_to_event_bridge(
    client: &aws_sdk_eventbridge::Client,
    payload: &Payload,
    bus_name: &str,
) -> Result<PutEventsOutput, SdkError<PutEventsError>> {
    let detail_type = "rust-demo".to_string();
    let s = serde_json::to_string(&payload).expect("Error serde");
    let request = aws_sdk_eventbridge::types::builders::PutEventsRequestEntryBuilder::default()
        .set_source(Some(String::from("RustDemo")))
        .set_detail_type(Some(detail_type))
        .set_detail(Some(String::from(s)))
        .set_event_bus_name(Some(bus_name.into()))
        .build();
    client.put_events().entries(request).send().await
}

```

This function returns back a Result that includes the PutEventsOutput and the SdkError.  The calling function can decide what to do with that return value.

In the case of our API handler, using a Match to determine the response is the right approach.

</CH.Section>

## Congrats

And that's all there is to it.  This was a simple example but highlights how to use the AWS SDK for Rust to submit PutEvents into an EventBridge Bus.

