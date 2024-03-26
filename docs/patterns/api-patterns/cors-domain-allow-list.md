---
sidebar_position: 1
title: CORS Origin Allow List
description: Cross-Origin Resource Sharing origin allow list
keywords: [rust,lambda,api gateway, cors]
---

Working with Cross-Origin Resource Sharing (CORS) is not something many developers look forward to doing.  Add in the fact that when building a private API there are requirements to respond correctly and safely with the proper Origin.  AWS' API Gateway thankfully allows a builder to response to OPTIONS requests with a custom implementation.  

In this article we are going to look at using a Lambda Function to respond to an OPTIONS request that validates the Origin header against a list of allowed origins.  Also known as an allow list.

## Sample Solution

A template for this pattern can be found under the [./templates](https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/api-patterns/cors-allow-list/) directory in the GitHub repo. You can use the template to get started building an API Gateway CORS allow list with a Lambda Function.

![API Gateway CORS](/img/patterns/api-patterns/CORS.png)

A nice thing about using a Lambda Function for handling CORS is that API Gateway can send a standard Proxy Request payload into the function just like other endpoints.  That pattern of handling a proxy request can be further explored in the [Lambda Function per Verb](cdk-cargo-lambda-lambda-per-verb-ddb.md) article.

Below are three aspects of this sample solution.

1.  Main function
2.  Lambda handler code
3.  Checking the origin against the allow list

Let's dive in and look at the code!

### Main Function

<CH.Section>

All Lambda Functions in Rust have a [`main`](focus://2) function entry point.  It's the first function that is called and helps initialize defaults or items that'll be used throughout the lifecycle of the request. The main function in this sample includes the [`Tokio`](focus://1) macro so that this main can run asynchronous code.

The key thing to note is that I'm requiring a variable called [`ALLOWED_ORIGINS`](focus://9[29:43]) which is a comma-separated list of acceptable domains and allowed by this CORS function.  Imagine though that you have a larger list of allowed domains?  This could be pivoted to a DynamoDB table or a cache.

```rust
#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .json()
        .init();

    let origins = env::var("ALLOWED_ORIGINS").expect("ALLOWED_ORIGINS must be set");
    let allowed_origins = &origins;

    run(service_fn(move |payload: Request| async move {
        function_handler(allowed_origins, payload).await
    })).await
}
```
</CH.Section>

### Handler Function

<CH.Section>

The handler takes a pointer to the [`allow list`](focus://2) string and the incoming request that will have a header HeaderMap.  I then pair it with a [`get_origin`](focus://5[10:20]) function that checks the allow list for the value in the Origin header.

We'll have a look at that function next, but let's explore the results of it first.  

The [`match`](focus://5) line highlights that I'm returning an Option from that function which helps drive the response back to the caller.  In the case of [`Some`](focus://6), I'm building a successful response with the single domain returned in the origin.  You cannot return a list of domains back.  And be careful, you don't want to just "mirror" the incoming domain, which is why I have the allow list.

In the case of [`None`](focus://16), I'm returning a 400 BAD_REQUEST.

```rust
async fn function_handler(
    allowed_origins: &str,
    event: Request,
) -> Result<impl IntoResponse, Error> {
    match get_origin(event.headers(), allowed_origins) {
        Some(origin) => {
            let response = Response::builder()
                .status(StatusCode::OK)
                .header("Access-Control-Allow-Origin", origin)
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST, OPTIONS, PATCH")
                .body("".to_string())
                .map_err(Box::new)?;
            Ok(response)
        }
        None => {
            let response = Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body("".to_string())
                .map_err(Box::new)?;
            Ok(response)
        }
    }
}
```

</CH.Section>

### Check the Allow List

<CH.Section>

Now let's explore the [`get_origin`](focus://1) function and its simple purpose.  It will inspect the HeaderMap, verify that the Origin key exists and then compares it against the allow list.

If any of those checks fail, it will return `None` back to the handler code so it can then return the 400 BAD_REQUEST as seen above.

But if things go well, the origin is returned back in a [`Some`](focus://7) statement.

```rust
fn get_origin(headers: &HeaderMap, allowed_origins: &str) -> Option<String> {
    return match headers.get("origin") {
        Some(origin) => {
            let s = allowed_origins.split(',');
            for o in s {
                if o == origin {
                    return Some(o.to_string());
                }
            }

            None
        }
        None => {
            None
        }
    };
}
```

</CH.Section>

## Wrapping Up

CORS can be tricky sometimes.  It can also add overhead if you are doing checks when building an allow list when you need to be able to return success for a specific origin.  By using Lambda Functions with Rust you gain the flexibility to check the allow list that meets your needs but also do it in a highly-performant way because it's coded in Rust.  There are places to take this further but this example should be a great starting point for those explorations.

## Congrats

Congratulations, you know have a starting point to build a Lambda Function coded in Rust to handle a custom allow list with API Gateway and CORS,
