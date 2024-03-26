---
sidebar_position: 1
title: How Lambda Works
description: A walkthrough of the key concepts around AWS Lambda and how it executes
keywords: [fundamentals]
---

# How Lambda Works

AWS Lambda is an event-driven way of running your application workloads. Lambda only runs when there is an event for it to react to, and there is no charge for when your function is not executing.

But you might be wondering how Lambda actually works! Let's walk through this step by step:

### 1. A new request is received

Ok, so a new request has come into your Lambda function and Lambda needs to react to it. The first thing that happens is that the Lambda service prepares an _`execution environment`_. During this step, the Lambda service:

- Initializes the runtime
- Downloads your function code from either [Amazon S3](https://aws.amazon.com/s3/) or [Amazon ECR](https://aws.amazon.com/ecr/)
- Runs any initialization code outside of your function handler

The time all of that takes is what is known as a _`cold start`_. You'll see that come up a lot when we talk about Lambda.

### 2. The request is passed to Lambda

Now that there is an execution environment available your function handler can execute. Lambda passes the payload to your function and your code runs. In Rust, the runtime itself can (de)serialize this event payload into a C# object. More on that in the next section!

### 3. Post Execution

After your function handler has completed the Lambda execution environment is frozen. To improve performance the execution environment is retained for a period of time. If another request is received at this point the same execution environment will be re-used. This is what is known as a _`warm start`_.

## Handling Multiple Requests

We've walked through a simple example there in which Lambda receives a single request. But what happens if Lambda receives 2, 10, 1000 requests simultaneously. An important thing to remember is that each execution environment will only ever process **one request at any one time**.

What this means is that if you received 10 requests simultaneously, you are likely to get 10 cold starts and 10 seperate execution environments (providing there aren't any existing ones). As a default, you can have 1000 concurrent Lambda executions, but that is a soft limit and can be raised. Check out the [quotas on the AWS Docs](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html).

## Cold Starts

A quick note on _`cold starts`_. Cold starts typically occur in a small number of production workloads, especially if you have consistent traffic patterns. However, in development you will see a _`cold start`_ after every change to your Lambda function.

When you update the code for your function, you are guaranteed to get a brand new execution environment. When developing, this can give the impression that Lambda is always going to be slow. 

It's important to look at this through the lens of your production load and in a later section we will explore things you can do to analyze the number of cold starts in your environment.