---
sidebar_position: 1
title: DynamoDB Basic Operations
description: Demonstrate basic DynamoDB operations with the AWS SDK
keywords: [rust,lambda,dynamodb,aws,aws sdk,sdk]
---

## Introduction

The [AWS SDK for Rust](../../fundamentals/aws-sdk-rust) has been developed to simplify operations with various AWS services including [DynamoDB](https://docs.rs/aws-sdk-dynamodb/latest/aws_sdk_dynamodb/).  By leveraging the SDK, you can take advantage of the data plane operations exposed over the API like GetItem, PutItem, Scan and the other core DynamoDB operations.

This article looks to explore the foundational operations that you will encounter when working with AWS, DynamoDB and Rust.  They will be applicable whether you are building and shipping with [Lambda](../../fundamentals/how-lambda-works.md) or with Containers.

## DynamoDB Operations

In this article we are going to cover the following operations:

-   [Creating a DynamoDB SDK client](#creating-a-client)
-   [GetItem](#getitem-request)
-   Query
-   Scan
-   PutItem
-   UpdateItem
-   DeleteItem

Topics not covered but will be in future articles include BatchItem operations, Transactions and Paginiation.

### Creating a Client

When working with any of the services via the AWS SDK for Rust, you first need to create a client that can interact with its API.  This client is usually shared throughout the lifetime of your service so it's essentially a singleton instance.

First, in the Cargo.toml, you need to tell Cargo that you want to bring in the DynamoDB SDK.

<CH.Code>
```toml Cargo.toml
[dependencies]
# more contents omitted for brevity
aws-config = { features = ["behavior-version-latest"], version = "1.0.1" }
aws-sdk-dynamodb = "1.2.0"
```
</CH.Code>

<CH.Section>
With dependencies pulled in, it's time to build a client.

Two things worth pointing out in the code below.  First up, [the region](focus://2:3) needs to be specified.

The second thing to point out is that this code will allow the client to be [configured locally](focus://5:9).  What this enables is the running of DynamoDB locally or in an integration test in a continuious integration pipeline.

<CH.Code>


```rust client.rs
pub async fn new_client(is_local: String) -> Client {
    let region_provider = RegionProviderChain::default_provider()
        .or_else("us-west-2");
    let sdk_config = aws_config::from_env().region(region_provider).load().await;
    if is_local.to_ascii_lowercase() == "true".to_string() {
        let config = aws_sdk_dynamodb::config::Builder::from(&sdk_config)
            .endpoint_url("http://localhost:8000".to_string())
            .region(Region::from_static("us-east-1"))
            .build();
        return Client::from_conf(config);
    }

    let config = aws_sdk_dynamodb::config::Builder::from(&sdk_config).build();
    Client::from_conf(config)
}
```

</CH.Code>
</CH.Section>

### GetItem Request

Each of the following sections will have a [link](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) that references the specific documentation.  The point of this article isn't to describe how DynamoDB works, but more to highlight how to operate the functions with the AWS SDK for Rust.

For reference:

> The GetItem operation returns a set of attributes for the item with the given primary key. If there is no matching item, GetItem does not return any data and there will be no Item element in the response. - AWS Documentation

<CH.Section>

There are two samples included below that showcase how to execute [`get_item`](focus://3).

The key things to note are that you can specify key as a single partition key or you can use a HashMap to use a compound partition key and range key if the table requires.

What is really nice about working with item that are returned from DynamoDB, the very familiar serde crate that is used throughout Rust for working with JSON can be used for this data as well which is also JSON.

<CH.Code>

```rust get_item_partition_key.rs
pub async fn fetch_item(client: &Client, table_name: &str, id: &str) -> Result<User, QueryError> {
    let output = client
        .get_item()
        .key("id".to_string(), AttributeValue::S(id.to_string()))
        .table_name(table_name)
        .send()
        .await?;

    match output.item {
        Some(item) => {
            let i: BasicEntity = serde_dynamo::from_item(item)?;
            Ok(i)
        },
        None => Err(QueryError::NotFound)
    }
}
```
```rust get_item_partition_and_range_key.rs
pub async fn fetch_item(client: &Client, table_name: &str, id: &str) -> Result<User, QueryError> {    
    let key_map: HashMap<String, AttributeValue> = [
        ("PK".to_string(), AttributeValue::S(id)),
        ("SK".to_string(), AttributeValue::S(id)),
    ]
    .iter()
    .cloned()
    .collect();

    let output = client
        .get_item()
        .set_key(Some(key_map))
        .table_name(table_name)
        .send()
        .await?;

    match output.item {
        Some(item) => {
            let i: BasicEntity = serde_dynamo::from_item(item)?;
            Ok(i)
        },
        None => Err(QueryError::NotFound)
    }
}
```

</CH.Code>

</CH.Section>

### PutItem Request

A PutItem is an update of the entire item that exists in DynamoDB under a specific key. 

> Creates a new item, or replaces an old item with a new item. If an item that has the same primary key as the new item already exists in the specified table, the new item completely replaces the existing item. You can perform a conditional put operation (add a new item if one with the specified primary key doesn't exist), or replace an existing item if it has certain attribute values. You can return the item's attribute values in the same operation, using the ReturnValues parameter. - AWS

<CH.Section>

Using PutItem requires that the item's attributes be supplied in the request.  Remember, this is a replacement of the item that was there before.  They key is specified as part of the entity as well so you won't see a "key" function like on the [GetItem](#getitem-request).

<CH.Code>

```rust put_item.rs
pub async fn create_item(
    client: &Client,
    table_name: &str,
    item: BasicEntity,
) -> Result<BasicEntity, QueryError> {
    let _ = client
        .put_item()
        .item("id".to_string(), AttributeValue::S(item.get_id()))
        .item("name".to_string(), AttributeValue::S(item.get_name()))
        .item(
            "description".to_string(),
            AttributeValue::S(item.get_description()),
        )
        .item(
            "entity_type".to_string(),
            AttributeValue::S(item.get_entity_type()),
        )
        .item(
            "updated_at".to_string(),
            AttributeValue::N(item.get_updated_at().to_string()),
        )
        .item(
            "created_at".to_string(),
            AttributeValue::N(item.get_created_at().to_string()),
        )
        .table_name(table_name)
        .send()
        .await?;

    Ok(item)
}
```

</CH.Code>

</CH.Section>

### UpdateItem Request

When you only want to update parts of an item, you can use the UpdateItem request that DynamoDB provides.  It's defined like this:

> Edits an existing item's attributes, or adds a new item to the table if it does not already exist. You can put, delete, or add attribute values. You can also perform a conditional update on an existing item (insert a new attribute name-value pair if it doesn't exist, or replace an existing name-value pair if it has certain expected attribute values). - AWS

<CH.Section>

The UpdateItem request uses an [`update_expression`](focus://6) in combination with the [`expression_attribute_values`](focus://7) to perform the operation.  The appearance of the [`key`](focus://5) is also back just like in the [get_item](#getitem-request).

<CH.Code>

```rust update_item.rs
pub async fn update_item(client: &Client, table_name: &str, id: &str, timestamp: i64) -> Result<(), QueryError> {
    let _ = client
        .update_item()
        .table_name(table_name)
        .key("id", AttributeValue::S(id.to_string()))
        .update_expression("set updated_at = :updated_at")
        .expression_attribute_values(
            ":updated_at",
            AttributeValue::N(timestamp.to_string()),
        )
        .send()
        .await?;

    Ok(())
}
```

</CH.Code>

</CH.Section>

### DeleteItem Request

DeleteItem is used to accomplish just what it describes.  When you want to Delete an Item in DynamoDB.

> Deletes a single item in a table by primary key. You can perform a conditional delete operation that deletes the item if it exists, or if it has an expected attribute value. - AWS

<CH.Section>

Using [`delete_item`](focus://3) will look a lot like [get_item](#getitem-request) and [update_item](#updateitem-request) in that it uses the [`key`](focus://4) function.  That key is the only thing that needs to be supplied from a payload standpoint.  

One thing to note is that this is returning [`AllOld`](focus://6) so that we can determine that the operation was [successful and the item was found and deleted](focus://10:13).

<CH.Code>

```rust delete_item.rs
pub async fn delete_item(client: &Client, table_name: &str, id: &str) -> Result<(), QueryError> {
    let output = client
        .delete_item()
        .key("id".to_string(), AttributeValue::S(id.to_string()))
        .table_name(table_name)
        .return_values(aws_sdk_dynamodb::types::ReturnValue::AllOld)
        .send()
        .await?;

    match output.attributes() {
        Some(_) => Ok(()),
        None => Err(QueryError::NotFound),
    }
}
```

</CH.Code>
</CH.Section>

### Scan Request

Scan is sometimes a dirty operation.  It doens't leverage any keys and just walks through the table.  In future articles, we will address pagination, but for this example, the below is just a simple Scan operation.

> The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index. To have DynamoDB return fewer items, you can provide a FilterExpression operation. - AWS

<CH.Section>

<CH.Code>

```rust scan.rs
pub async fn get_items(
    client: &Client,
    table_name: &str,
    limit: i32
) -> Result<Vec<BasicEntity>, QueryError> {

    let output = client
        .scan()
        .limit(limit)
        .table_name(table_name)
        .send()
        .await?;

    match output.items {
        Some(item) => {
            let mut entities: Vec<BasicEntity> = Vec::new();

            for i in item {
                let entity: Result<BasicEntity, serde_dynamo::Error> = serde_dynamo::from_item(i);
                match entity {
                    Ok(entity) => {
                        entities.push(BasicEntity::from(entity));
                    }
                    Err(e) => {
                        error!("(Error)={:?}", e);
                    }
                }
            }

            Ok(entities)
        }
        None => {
            Ok(Vec::new())
        }
    }
}

```

</CH.Code>
</CH.Section>

## Running the Sample

All of the above operations are available in the sample code found [./templates](https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/database-patterns/ddb-basic-operations/).  You will find [client building](#creating-a-client) in addition to models, errors and a main function that will execute all of the examples.

In order to execute the code, make sure that you have three things configured:

1.  An AWS Account with a DynamoDB created with just a partition key defined as `id`.
2.  Access locally to read/write/delete items from that DynamoDB table.
3.  An environment variable called `TABLE_NAME` set to the table name created in item 1.

When running the same, you'll see the following occur.

-   A loop is run 100 times
-   An item is created
-   Then it is fetched
-   Every 10 items the UpdateItem operation is executed on the `updated_at` field
-   At the very end, the table is scanned and items are printed back out to the console

## Congratulations

Congratulations, you've seen how to establish a new Client with DDB and Rust in addition to the basic data plane operations.  More to come on Pagination, Transactions and BatchItem Operations.