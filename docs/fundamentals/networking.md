---
sidebar_position: 3
title: Lambda Networking
description: A walkthrough of how networking works in AWS Lambda.
keywords: [fundamentals]
---

# Lambda Networking

Many of you will have existing 'server-full' applications that run within a VPC on AWS. To connect your Lambda functions to these applications it's important to understand how networking works in Lambda.

![Lambda networking diagram](/img/lambda-networking.png)

When configuring your Lambda function there is an option to set a range of _`SubnetIds`_ and a _`SecurityGroupId`_. These settings configure the entrypoint for Lambda network traffic. However, Your Lambda functions **always** run within a Lambda service owned VPC! Yep, that's right. When you configure the network settings that doesn't mean the function will run within your account.

Instead, an [Elastic Network Interface (ENI)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html) is created in the _`Subnets`_ and _`SecurityGroups`_ you specified. This ENI provides a connection back to the Lambda service VPC through a Hyperplane [NAT Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html).

## Considerations

The ENI deployed into your account **will** use an IP address out of the available IP's in the specified _`Subnet`_. Lambda will use 1 IP address per function. If you have 1000 invocations and 9 versions that will still only use a single ENI and IP address. Without careful management it's easy to exhaust the IP range in your subnets. I'd suggest having a subnet and IP block specifically for Lambda.

Now that all network traffic leaving your function will run through the _`Subnet`_ specified all of that traffic is at the mercy of your network. Security groups, NACL's, route tables can all affect the functionality of your application. If your function code needs to talk to a public AWS service (S3 for example) or a 3rd party API you need to ensure the network routes are available.

Finally, you need to consider Lambda scaling and how that will affect your server-full resources. Databases are the common challenge. Lambda, as a default, will scale up to 1,000 concurrent executions. This may mean 1,000 concurrent connections to your database. There are ways to protect against that with services like [RDS Proxy](https://aws.amazon.com/rds/proxy/), but more on that later. For now, just consider how your existing resources will cope with Lambda's fast scaling.

### Further Reading

- [Improved Networking for AWS Lambda functions, AWS Blog](https://aws.amazon.com/blogs/compute/announcing-improved-vpc-networking-for-aws-lambda-functions/)