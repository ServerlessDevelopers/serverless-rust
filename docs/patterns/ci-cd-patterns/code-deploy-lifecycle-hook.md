---
sidebar_position: 1
title: Code Deploy Lifecycle Hook
description: Implementig a CodeDeploy LifeCycle Hook
keywords: [rust,lambda,ci/cd,lifecycle,codedeploy]
---

## Introduction

[AWS CodeDeploy](https://aws.amazon.com/codedeploy/) is a fully managed deployment coordinator that provides flexiblity during the deployment lifecyle.  It can be defined like this:

> AWS CodeDeploy is a fully managed deployment service that automates software deployments to various compute services, such as Amazon Elastic Compute Cloud (EC2), Amazon Elastic Container Service (ECS), AWS Lambda, and your on-premises servers. Use CodeDeploy to automate software deployments, eliminating the need for error-prone manual operations. - AWS

CodeDeploy provides 5 unique hooks that are implemented with a Lambda Function.  They are:

1.  BeforeInstall
2.  AfterInstall
3.  AfterAllowTestTraffic
4.  BeforeAllowTraffic
5.  AfterAllowTraffic

To read more in detail [here's the documentation](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html#reference-appspec-file-structure-hooks-list-ecs)

## Sample Solution

A template for this pattern can be found under the [./templates](https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/ci-cd-patterns/codedeploy-lifecycle-hook/) directory in the GitHub repo. You can use the template to get started building with CodeDeploy LifeCycle Hooks and Lambda.

### Main Function

<CH.Section>
Rust programs start off with a [`main`](focus://2) function.  The main function in this sample includes the [`Tokio`](focus://1) macro so that this main can run asynchronous code.

The only piece of this function that is required is an environment variable named [`ALB_URL`](focus://11).  The 
purpose of that variable is to allow the function to read the application load balancer that it can send a request or series of requests to on the test target group.

```rust
#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .json()
        .with_target(false)
        .without_time()
        .init();


    let alb_url = std::env::var("ALB_URL").expect("ALB_URL must be set");
    let alb_str = &alb_url.as_str();

    run(service_fn(
        move |event: LambdaEvent<HashMap<String, String>>| async move {
            function_handler(alb_str, event).await
        },
    )).await
}
```
</CH.Section>

### Handler

Every time this function is triggered, it's going to receive a payload of `HashMap<String, String>`.  As of this writing, the Rust Lambda Events project hasn't published the code that supports a strongly-typed struct.  For reference, [here is that code](https://github.com/awslabs/aws-lambda-rust-runtime/blob/de822f9d870c21c06b504d218293099f691ced9f/lambda-events/src/event/codedeploy/mod.rs#L68)

<CH.Section>

Let's dig through what all is happening.

The first part of this handler is fetching out the values from the payload.  We need to use the [`deployment_id`](focus://2) and [`lifecycle_event_hook_execution_id`](focus://3) to signal back to the CodeDeploy execution whether this deployment should continue or fail.  

A quick note when looking at those two lines of code, I'm unwrapping the get operation.  While I normally don't recommend this, I'm confident that AWS is goig to send me what I expect.  If I was to test this with faulty payloads, you would get an exception.

[`Line 11`](focus://11) shows a call to [`run_test`](focus://11[21:28]).  We'll explore that function below but it's purpose is to run a path on the ALB_URL that was supplied through environment variables.  Based on the output of that function, the handler will decide to either [`Succeed`](focus://17) or [`Fail`](focus://19) the CodeDeploy deployment.

That status will then be based back through the [`put_lifecycle_event_hook_execution_status`](focus://23:27)

```rust
async fn function_handler(alb_url: &str, event: LambdaEvent<HashMap<String, String>>) -> Result<(), Error> {
    let deployment_id = event.payload.get("DeploymentId").unwrap();
    let lifecycle_event_hook_execution_id = event.payload.get("LifecycleEventHookExecutionId").unwrap();

    let config = aws_config::load_from_env().await;
    let client = Client::new(&config);

    let mut passed = true;

    // replaces the "one" to the route that needs to be exercised
    if let Err(_) = run_test(alb_url, "one".to_string()).await {
        info!("Test on Route one failed, rolling back");
        passed = false
    }

    let status = if passed {
        LifecycleEventStatus::Succeeded
    } else {
        LifecycleEventStatus::Failed
    };

    let cloned = status.clone();
    client.put_lifecycle_event_hook_execution_status()
        .deployment_id(deployment_id)
        .lifecycle_event_hook_execution_id(lifecycle_event_hook_execution_id)
        .status(status)
        .send().await?;

    info!("Wrapping up requests with a status of: {:?}", cloned);
    Ok(())
}

```
</CH.Section>

### Run Test Function

<CH.Section>
The [`run_test`](focus://1[10:17]) function accepts a url and path and then executes an HTTP request on the full URL built by those inputs.  As long as the endpoint returns anything [`2xx`](focus://9), the handler will consider the execution a success.  Anything else, and an [`error`](focus://12)

```rust
async fn run_test(url: &str, path: String) -> Result<(), Error> {
    let request_url = format!("http://{url}/{path}", url = url, path = path);
    info!("{}", request_url);

    let timeout = Duration::new(2, 0);
    let client = ClientBuilder::new().timeout(timeout).build()?;
    let response = client.head(&request_url).send().await?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err(format!("Error: {}", response.status()).into())
    }
}
```

</CH.Section>

## Seeing it in Action

With all of this in place and attached to a CodeDeploy, you'll see output like this.  A CodeDeploy executing or skipping the hooks that have been defined just like the Lambda Function code above.

![CodeDeploy Lambda Function Hooks](/img/patterns/ci-cd-patterns/code_deploy.png)

## Congratulations

And that's it! Congratulations, you now know how to implement a CodeDeploy LifeCycle Hook in Lambda with Rust!