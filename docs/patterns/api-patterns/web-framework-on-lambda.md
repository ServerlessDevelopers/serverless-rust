---
sidebar_position: 3
title: Web Framework on Lambda
description: Web Framework on Lambda
keywords: [rust,lambda,api gateway, lambda web adapter]
---

Adopting the [single Lambda per verb](./cdk-cargo-lambda-lambda-per-verb-ddb.md) way of building serverless API's with Lambda can be a paradigm shift. If you're a developer familiar with starting up your API on localhost, testing and debugging locally before pushing out to production this shift can be a challenge.

If this feels like you, then this article walks you through how you can use the [Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter) alongside the Rocket web framework for Rust to deploy an entire web application to AWS Lambda.

Even though this article uses Rocket, this same process would apply for Actix, Axum or Leptos. Basically, as long as you're using a web framework that can startup on localhost then you're in the right place.

## Why Might You Want To Do This?

This article isn't going to dive into the nuanced (and potentially controversial) topic of monolithic Lambda's vs having a separate Lambda function per HTTP endpoint and verb. What it will tell you, is why you might want to choose this approach:

1. A more familiar developer experience
2. A lower *total number* of cold starts
    - If 4 endpoints on your API are called sequentially, you will only see 1 cold start as opposed to 4

However, choosing this approach does have it's trade offs:

1. Slower cold starts. This one is less of a problem with Rust, that starts up quickly anyway. But comparing a single invoke of a web framework on Lambda vs single purpose handlers is almost always going to be slower. Refer to point 2 above for the more nuanced answer to this question
2. The GET and POST, PUT, DELETE endpoints on your API typically have different security and memory requirements. This approach doesn't allow you to optimise for the specific use case

This article on the [AWS Compute Blog by Luca Mezzalira](https://aws.amazon.com/blogs/compute/comparing-design-approaches-for-building-serverless-microservices/) covers this nuance well. And remember, you can do a combination of both. An API with 10 endpoints could have 9 served by a web framework on Lambda and a single highly optimised endpoint served by a single purpose function. This is the magic of API Gateway + Lambda.

## Project structure

A template for this pattern can be found under the [./templates](https://github.com/jeastham1993/serverless-rust.github.io/tree/main/templates/patterns/api-patterns/api-on-lambda/) directory in the GitHub repo. You can use the template to get started building with API Gateway and Lambda.

```bash
src
```

Because you are just building a 'standard' web API using the Rocket framework, the project directory looks just like a standard Rust project.

## API Code

<CH.Section>

Looking at the application code, you'll notice it looks just like a standard Rocket web API. The [`rocket()` function](focus://16:28) starts up a Rocket web application and the respective routes are mounted.

```rust
#[get("/<id>")]
fn get_by_id(id: &str) -> Json<ViewModel> {
    info!("id: {:?}", id);

    // execute the get in the DB

    let model = Model::new("New Model".to_string());
    // convert to a view model
    let view_model:ViewModel = model.into();

    Json(view_model)
}

// Other endpoints removed for brevity...

#[launch]
fn rocket() -> _ {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    rocket::build()
        .mount("/", routes![get_by_id, delete_by_id, create, update_by_id])
}
```

As long as this code starts up on a local port, this code will run.

</CH.Section>

<CH.Section>

This is all made possible by the [Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter) (LWA). LWA runs as a layer alongside your Lambda function. It's job is to take the incoming request payload and use that to make a HTTP request to your web application running inside the Lambda environment.

You can think of LWA as a proxy/translation layer.

You'll also notice that the [AWS_LWA_PORT](focus://10:12) environment variable is being set to 8000. This is because the Rocket web application starts up on port 8080. LWA defaults to port 8080, so if you're application starts up on 8080 you don't need to set this variable.

```yaml
Resources:
  RocketWebFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Handler: bootstrap
      Runtime: provided.al2023
      Architectures:
        - arm64
      Environment:
        Variables:
          AWS_LWA_PORT: 8000
      Layers:
        - !Sub arn:aws:lambda:${AWS::Region}:753240598075:layer:LambdaAdapterLayerArm64:20
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
    Metadata:
      BuildMethod: rust-cargolambda
```

</CH.Section>

And that is all there is to deploying an entire web API to AWS Lambda. And although you are running a slightly more monolithic Lambda, don't take that as a signal to add hundreds of endpoints to your API running inside Lambda. Still practice microservices, and break things down into smaller chunks.