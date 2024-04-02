---
title: Cargo TOML File
description: Managing a binary or library dependencies with the Cargo.toml file
keywords: [fundamentals]
---

The Cargo.toml file is a part of each Rust package and is called a manifest.  In this file there are several aspects that describe the type of package (bin or lib), the dependencies that this package will use and some meta information like authors, license and edition.  In Rust-speak, a "bin" is a project that compiles down to a binary exectuable. And in contrast, a "lib" is a library project that compiles to something that can be shared and linked into another project.

For a full reference of the [Cargo file](https://doc.rust-lang.org/cargo/reference/index.html), the Cargo documentation is a much more in-depth review of the components and how to make the most of it.

However, below are some useful dependencies that you'll find spread throughout this website which are worth mentioning in a little more depth.

## Dependencies

When working with Rust and Serverless, there are several dependencies that make building easier.  Let's take a look at what those are and where they comes from.

### Base Dependencies
<CH.Section>

There are certain crates that are useful pretty much all of the time.  They are things like 

-   [`Serializers and Deserializers`](focus://6:7)
-   [`Tokio for running main asynchronously`](focus://3)
-   [`Tracing libraries for generating logs and traces`](focus://4:5)

This will generally look like this in the Cargo.toml.
<CH.Code>
```toml Cargo.toml
# more is above but omitted for brevity
[dependencies]
tokio = { version = "1.36.0", features = ["macros"] }
tracing-subscriber = "0.3.18"
tracing = "0.1.40"
serde = { version = "1.0.197", features = ["derive"] }
serde_json = "1.0.114"
```
</CH.Code>
</CH.Section>

### Lambda Specific Dependencies

One or possibly two crates will be promiment in the example [templates](https://github.com/ServerlessDevelopers/serverless-rust/tree/main/templates/patterns) that you'll encounter on this site.  The reason it is one or two is because when using the lambda_http crate, it will abstract away the operations and runtime that will be used with leveraging the lambda_runtime crate.  When using lambda_runtime, you'll also include aws_lambda_events.

<CH.Section>
- HTTP event
    -   [`lambda_http`](focus://4) will be the only crate you use for working with both serde of JSON into your structs and handling events
- All other events
    -   [`lambda_runtime`](focus://6) is the runtime crate that allows your main function will use to trigger your handler code.
    -   [`aws_lambda_events`](focus://7) is a crate the provides struct definition for many of the AWS event payloads.  You will need to enable the features you want such as the below which highlights DynamoDB structs.

<CH.Code>

```toml Cargo.toml
# more is above but omitted for brevity
[dependencies]
# If HTTP Events
lambda_http = "0.10.0"
# All Other events
lambda_runtime = "0.9.2"
aws_lambda_events = { version = "0.14.0", default-features = false, features = [ "dynamodb" ] }
```

</CH.Code>
</CH.Section>

### Shared Code

In a number of the examples on this site, you'll see references to a shared library.  Remember, Rust doesn't need layers or a dedicated runtime because of the fact that your code is compiled to a binary specific to the chip architecture you have selected.  

That doesn't mean that there isn't a way to share code though.  Cargo provides you with a chance to build binaries and libraries.  The Lambda Functions are designated as binaries and this shared library is marked as a lib.  Then in your binary Lambda Functions, you can reference the shared library just like the below.

<CH.Code>

```toml Cargo.toml
# more is above but omitted for brevity
[dependencies]
shared = { path = "../shared" }
```

</CH.Code>

## Wrapping Up

Cargo is a powoerful feature of the Rust ecoystem and using it correctly can do a few things for you. 

1.  Improve developer experience
2.  Correctly manage dependencies for your Lambda Functions
3.  Impact your overall binary size.  Don't bring in crates that you don't need.
4.  Accurately document your binaries and libraries
5.  Harness powerful subcommands like [Cargo Lambda](./ci-cd/cargo-lambda.md)

