---
sidebar_position: 2
title: EventBridge Event Handler
description: Lambda function for handling an event from Amazon EventBridge
keywords: [rust,lambda,eventbridge,messaging,putevent]
---

As mentioned in several of the other messaging quick starts, the publisher/subscriber (pub/sub) pattern is extremely common in a serverless architecture. Severless encourages micro and someties even nano-sized components that are assembled together by way of contracts as opposed to building everything into a single binary.

AWS' EventBridge is a service that describes itself like this:

> Amazon EventBridge Event Bus is a serverless event bus that helps you receive, filter, transform, route, and deliver events. - AWS

It provides a Default Bus or you are able to add Custom Event Buses to fit your need.  This article will look to showcase how to create a Lambda function that handles an event from an EventBridge custom bus. It also takes the publishing component from the article on [Event Bridge Put Events](./eventbridge-putevent.md) to give a cohesive pub/sub experience.

## How It Works

The sample in this tutorial builds upon a Lambda that listens on a Function URL and then generates an EventBridge PutEvent with a custom domain model. A Rule is defined by the subscriber on the custom event bus that sends any matching messages to a Lambda function. The subscriber Lambda function will deserialize and process the message.

The EventBridge -> Lambda integration is an example of an [async invoke](../../fundamentals/invocation-modes.md#asynchronous-invokes). Internally inside the Lambda service the events are queued up onto an SQS queue managed by Lambda, and your function is invoked from here.

An important note, the sample application deploys the publisher, subscriber and event bus using the same infrastructure as code template. This is for ease of demonstration. Typically the 3 components would be deployed as 3 independent stacks.

## Project Structure

A Lambda and EventBridge Event handler template is found under the [./templates](https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/messaging-patterns/eventbridge-handler) directory in the GitHub repo. You can use template to get started building with EventBridge and Lambda.

The template is simple, and is based upon the following structure.

```bash
lambdas
  - event-handler
  - publisher
  - shared
```

## Lambda Code

### Main 

<CH.Section>

When handling messages from EventBridge with Lambda your Lambda code will look much like the other services covered as part of the [messaging patterns](../messaging-patterns/). The main function sets up the logging framework, and then starts the Lambda runtime. Passing in the [function to use as the handler](focus://9).

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

</CH.Section>

### Handler Code

<CH.Section>
The handler code in this sample is deserializing the `detail` of the event that comes from EventBridge and using a handler from your custom business logic to actually process the message.

The [`LambdaEvent` that comes into your handler function is of type `CloudWatchEvent`](focus://1[26:63]). Before EventBridge became it's own service, it was called CloudWatch events. Hence the name of the struct being `CloudWatchEvent`. 

For re-usability, a custom [`InternalMessage`](focus://2) struct is used as a wrapper around the `CloudWatchEvent` type that comes from the [Lambda events Crate](https://docs.rs/aws_lambda_events/latest/aws_lambda_events/). This allows the [`try_into()`](focus://3) function to be used to handle the conversion from the custom CloudWatchEvent type into the `Payload` type used by the application.

Note that if the [`try_into()` call fails](focus://14:16) or the [`handle()` function call fails](focus://11) the handler returns an error. This will return an error back to the Lambda runtime. 

```rust
async fn function_handler(event: LambdaEvent<CloudWatchEvent>) -> Result<(), Error> {
    let payload: Result<Payload, MessageParseError> = InternalMessage(event.payload)
        .try_into();

    match payload {
        Ok(payload) => {
            let _handle_res = PayloadHandler::handle(&payload).await;

            match _handle_res {
                Ok(_) => Ok(()),
                Err(e) => Err(e.into())
            }
        }
        Err(err) => {
            Err(err.into())
        }
    }
}
```
</CH.Section>

<CH.Section>

By default, EventBridge retries sending the event for 24 hours and up to 185 times with an exponential back off and jitter, or randomized delay. You can [control this retry behavior](focus://12:16), and the routing to a dead letter queue, using your Lambda event source configuration. This example uses AWS SAM to automatically create an [SQS queue](focus://14:16) for failures, and route any failed messages to the [DLQ after only one retry](focus://13).

```yaml
  EventHandlerFunction:
    Type: AWS::Serverless::Function # More info about Function Resource: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
    Metadata:
      BuildMethod: rust-cargolambda
      BuildProperties:
        Binary: event-bridge-handler
    Properties:
      FunctionName: serverless-rust-EventHandler
      CodeUri: .
      Handler: bootstrap
      Runtime: provided.al2023
      EventInvokeConfig:
        MaximumRetryAttempts: 1
        DestinationConfig:
          OnFailure:
            Type: SQS
      Architectures:
        - arm64
      Events:
        Trigger:
          Type: CloudWatchEvent
          Properties:
            EventBusName: !GetAtt RustDemoEventBus.Name
            Pattern:
              source:
                - RustDemo
```

</CH.Section>

## Deploy

You can deploy this example directly to your own AWS account using the [provided template](https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/messaging-patterns/eventbridge-handler). Simply clone the repo, and then run the below CLI commands from the repo root.

```
cd templates/patterns/messaging-patterns/eventbridge-handler/
sam build --beta-features
sam deploy
```

Once deployed, you can send a POST request to the Lambda function URL endpoint with the below body:

```json
{
    "name": "James",
    "message": "Hello YouTube"
}
```

After running the POST request and getting back a 200 response, you can use the `sam logs` CLI command to retrieve the logs for your EventBridge handler function.

```
sam logs --profile sandbox --stack-name event-bridge-rust
```

## Congrats

And that's all there is to it.  This was a simple example but highlights how you can use Rust, Lambda and EventBridge to build high performance event driven systems.

