---
sidebar_position: 2
title: Lambda Function per Verb
description: Lambda Function API per Verb
keywords: [rust,lambda,api gateway]
---

Writing an API with Lambda is a topic that is pretty well covered on the internet.  However, there are so many choices of packages, project structure, Lambda size, runtimes, and many other decisions that can overwhelm even the most accomplished builder.  Add into the mix the addition of Rust, and things take on an even different slant than with something you are comfortable with.  

If this feels like you, then let this article walk you through some design choices that'll help you get started.  And when you get to the end, you will be able to package this up and add your custom code and deploy something into AWS.

## Let's make some design choices

This article will take the following stances in order to allow you to focus on learning how to build an API with Rust.

1.  Every verb in this REST API will have its own Lambda Handler
2.  Will make use of this [Crate](https://docs.rs/lambda_http/latest/lambda_http/) for handling events and dealing with the Proxy Request
3.  A shared library will be a part of the build to reuse code.

With those clarifications out of the way, let's get started!

## Project structure

Settling on a project structure is sometimes the hardest part of a new build.  For simplicity and order, I like to put my code in the root directory of the project under a folder named `lambdas`.  I find that when I do that, I can also then segement my infrastructure as code into a separate directory named `infra`.  When working on projects, it's easier to collapse my brain on half of the solution just like folding the directory in my editor. 

A template for this pattern can be found under the [./templates](https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/api-patterns/lambda-per-verb/) directory in the GitHub repo. You can use the template to get started building with API Gateway and Lambda.

```bash
infra
  - to be filled out by your IaC
lambdas
  - delete-by-id
  - get-by-id
  - post
  - put-by-id
  - shared
```

The balance of this tutorial will dig into most of the `lambdas/<project>` solutions. 

## Lambda Code

Let's start off with the `post` Lambda

### Post
<CH.Section>

For each of these Lambdas, the main function is going to look the same.  I won't focus on using AWS SDK Clients, they are simply going to demonstrate who to parse payloads and return serialized objects.

When operating a POST request, the client is going to send a JSON payloadt to the endpoint.  The Lambda will need to handle that event, dersialize it into the struct I want and then do something with that data.  Usually persist it somewhere, but in the below example, it's just going to return it back out as a `ViewModel` object.

```rust
#[tokio::main]
async fn main() -> Result<(), Error>{
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(handler)).await
}
```

One thing to note is the [`tokio macro`](focus://1[3:13]) macro.  Macros in Rust are signals to the compiler to generate some code based upon the macros' definition.

The tokio macro allows the [`main`](focus://2[10:14]) function to run asynchronous, which is what the Lambda handler function requires.

</CH.Section>

With the main function defined, the last piece to do is build the handler.  The code below is a little verbose, but simply to demonstrate the handling of Optional values that the Rust language provides.  This can be simplified in spots but will be just fine for the demo code.


```rust
async fn handler(event: Request) -> Result<impl IntoResponse, Error> {
    let body = event.payload::<PostModel>();
    
    match body {
        Ok(item) => {
            match item {
                Some(i) => {
                    // convert to the model
                    let model: Model = i.into();
                    // do some work
                    // convert back to view model
                    let view_model: ViewModel = model.into();
                    let serde_model = serde_json::to_string(&view_model)?;
                    let resp = Response::builder()
                        .status(200)
                        .header("content-type", "text/json")
                        .body(serde_model)
                        .map_err(Box::new)?;
                    Ok(resp)
                }
                None => {
                    let resp = Response::builder()
                        .status(400)
                        .header("content-type", "text/json")
                        .body("".to_string())
                        .map_err(Box::new)?;
                    Ok(resp)
                }
            }
        }
        Err(e) => {
            let resp = Response::builder()
                .status(400)
                .header("content-type", "text/json")
                .body(e.to_string())
                .map_err(Box::new)?;
            Ok(resp)
        }
    }
}
```


Let's take a minute to walk through some key points of the above function.  

First, by using the lambda_http crate, we gain some convienence methods that make working with requests easier.  The `event.payload` line converts the incoming JSON body into the PostModel struct defined in the shared project.

The second thing to note is that this sample doesn't actually persist anything into the database but it still goes through the process of converting the incoming payload into a struct Model and then back out into a ViewModel.

The final point to pay attention to is that using the `match` operation in Rust gives you a bunch of chances to shape the payload that is returned to the client.

### Get by ID

With items persisting, you would have something to fetch from the database.  In the case of this handler, the sample is returning out a mocked Model and then converting it into a ViewModel.

```rust
use lambda_http::{Error, IntoResponse, Request, service_fn, run, Response, Body, RequestPayloadExt, RequestExt};
use tracing::info;
use shared::{Model, ViewModel};

#[tokio::main]
async fn main() -> Result<(), Error>{
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(handler)).await
}

async fn handler(event: Request) -> Result<impl IntoResponse, Error> {
    // get the path parameter
    let id = event
        .path_parameters_ref()
        .and_then(|params| params.first("id"))
        .unwrap();
    info!("id: {:?}", id);
    // fetch the model from the DB
    let model = Model::new("New Model".to_string());
    // convert to a view model
    let view_model:ViewModel = model.into();
    let view_mode_serde = serde_json::to_string(&view_model)?;

    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/json")
        .body(view_mode_serde)
        .map_err(Box::new)?;
    Ok(resp)
}
```

### Put by ID

Adding a PUT method will allow your clients to update the resources you expose.  The PUT endpoint combines the work we've been doing with POST and GET.  

```rust
use lambda_http::{Error, IntoResponse, Request, service_fn, run, Response, Body, RequestPayloadExt, RequestExt};
use tracing::info;
use shared::{Model, PostModel, PutModel, ViewModel};

#[tokio::main]
async fn main() -> Result<(), Error>{
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(handler)).await
}

async fn handler(event: Request) -> Result<impl IntoResponse, Error> {
    // get the path parameter
    let id = event
        .path_parameters_ref()
        .and_then(|params| params.first("id"))
        .unwrap();
    info!("id: {:?}", id);

    let body = event.payload::<PutModel>();

    match body {
        Ok(item) => {
            match item {
                Some(i) => {
                    // convert to the model
                    let model: Model = i.into();
                    // do some work
                    // convert back to view model
                    let view_model: ViewModel = model.into();
                    let serde_model = serde_json::to_string(&view_model)?;
                    let resp = Response::builder()
                        .status(200)
                        .header("content-type", "text/json")
                        .body(serde_model)
                        .map_err(Box::new)?;
                    Ok(resp)
                }
                None => {
                    let resp = Response::builder()
                        .status(400)
                        .header("content-type", "text/json")
                        .body("".to_string())
                        .map_err(Box::new)?;
                    Ok(resp)
                }
            }
        }
        Err(e) => {
            let resp = Response::builder()
                .status(400)
                .header("content-type", "text/json")
                .body(e.to_string())
                .map_err(Box::new)?;
            Ok(resp)
        }
    }
}
```

### Delete by ID

And lastly, there is the DELETE method.  Delete should grab the ID from the path and then execute the delete request and set the response to 204.  The most basic Lambda would look like this.

```rust
use lambda_http::{Error, IntoResponse, Request, service_fn, run, Response, Body, RequestPayloadExt, RequestExt};
use tracing::info;
use shared::{Model, ViewModel};

#[tokio::main]
async fn main() -> Result<(), Error>{
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(handler)).await
}

async fn handler(event: Request) -> Result<impl IntoResponse, Error> {
    let id = event
        .path_parameters_ref()
        .and_then(|params| params.first("id"))
        .unwrap();
    info!("id: {:?}", id);

    // execute the delete in the DB

    let resp = Response::builder()
        .status(204)
        .header("content-type", "text/json")
        .body("".to_string())
        .map_err(Box::new)?;
    Ok(resp)
}
```

## Shared Code

At this point, you've got the shell of an API build with Rust and Lambda.  Every one of these functions though depended upon some shared code.  With the project structure outlined at the top of the article, a `shared` directory which is a Rust Crate contains the models, data transfer objects, and other reusable code for these Lambdas.  Unlike interperted languages, Rust code needs to have these shared pieces of functionality compiled into the final binary.

Rust crates can take on many shapes, but in its most basic form, it can simply be a project that has a `lib.rs` file where the structs and functions are defined.

The shared `lib.rs` that supports the above code defines its structs and functions in the below sample.

```rust
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub struct Model {
    pub id: String,
    pub name: String
}

#[derive(Serialize, Debug)]
pub struct ViewModel {
    pub id: String,
    pub name: String
}

#[derive(Deserialize, Debug)]
pub struct PostModel {
    pub name: String
}

#[derive(Deserialize, Debug)]
pub struct PutModel {
    pub id: String,
    pub name: String
}

impl Model {
    pub fn new(name: String) -> Model {
        Model {
            id: Uuid::new_v4().to_string(),
            name
        }
    }
}

impl ViewModel {
    pub fn new(id: String, name: String) -> ViewModel {
        ViewModel { id, name }
    }
}

impl From<Model> for ViewModel {
    fn from(model: Model) -> Self {
        ViewModel {
            id: model.id,
            name: model.name
        }
    }
}

impl From<PostModel> for Model {
    fn from(model: PostModel) -> Self {
        Model {
            id: Uuid::new_v4().to_string(),
            name: model.name
        }
    }
}

impl From<PutModel> for Model {
    fn from(model: PutModel) -> Self {
        Model {
            id: model.id,
            name: model.name
        }
    }
}
```

And to use this code in the Lambda binaries, add this line to the Cargo.toml file in each of the Lambdas.

```toml
[package]
name = "get-by-id"
version.workspace = true
edition.workspace = true
authors.workspace = true
license.workspace = true

[dependencies]
shared = { path = "../shared" }

lambda_http = "0.10.0"
tokio = { version = "1.36.0", features = ["macros"] }
tracing-subscriber = "0.3.18"
tracing = "0.1.40"
uuid = { version = "1.7.0", features = ["v4","fast-rng","macro-diagnostics"]}
serde_json = "1.0.114"

```

And to wrap it all up, the Worspace Cargo.toml file that pulls everything together.

```toml
[workspace]
members = [ "lambdas/delete-by-id","lambdas/get-by-id", "lambdas/post", "lambdas/put-by-id", "lambdas/shared"]
resolver = "2"

[workspace.package]
version = "1.0.0"
authors = ["Benjamen Pyle", "James Eastham"]
license = "GPL-3"
edition = "2021"
```

## Congrats

And with that, you know have an API with a Lambda per Verb built in Rust!