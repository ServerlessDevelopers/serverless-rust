---
sidebar_position: 2
title: Cognito Token Customization
description: Lambda function for customizing Cognito Access and ID tokens
keywords: [rust,lambda,cognito,security]
---

Applications require security.  There isn't a debate here, they just do.  And serverless applications are no different.  One of the knocks against serverless is that it isn't secure.  That's 100% a false narrative.  However, serverless paired with Infrastructure as Code (IaC) can make it easy sometimes to ship things that do lack the proper controls.  

> AWS' Congitio is an product that aims to provide a frictionless customer identity and access management platform.  - AWS

If something is frictionless though, does it allow customization?  Cognito provides numerous customization endpoints and one that is often most useful is providing the ability to shape the OAuth2 ID and Access tokens that are represented as JSON Web Tokens (JWT).

Let's take a look at how to make that happen.

## How It Works

Cognito offers a builder a number of Lambda "hooks" that can be taken advantage of to tailor the user's sign in, sign up, and log out experience.  These are normal Lambda functions that have Cognito payloads the provide the context and information needed to shape the JWT outputs.

In this example, we are going to use DynamoDB as a datastore to provide additional information about the Cognito UserPool users so that we can add extra values into the claims of the two JWTs.  Remember, and for clarification:

 By adding some claims to the access token we can speed up the authorization process by not having to fetch key pieces of data needed to perform those authorizations. By sprinkling in key claims to the ID token, the client or UI can alter the user’s experience without needing to fetch those additional details.

 One last point to note, in order to customize access tokens, you must turn on the advanced security features in Cognito.  This does come with an additional cost, so just be aware.

 ## Project Structure

 This starter project is organized around a single Lambda handler with a shared library crate can be used for data access and models.  However, don't take simple for not powerful, because in one function we can customize both of the Cognito tokens.

 ```bash
 lambdas/
    handler/
    shared/
 Cargo.toml
```

A template that we will be working from that exercises the customization of Cognito tokens with Lambda is found under the [./templates](https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/security-patterns/cognito-token-customizer) directory in the GitHub repo. You can use template to get started building with Cognito and Lambda.

## Lambda Code

Let's walk through the Lambda handler, main function, and shared library code to get a sense for what all you can do with Cognito, Rust and Lambda.

### Main Function

<CH.Section>

The main function of a Rust Lambda handler will often look very similar.  It usually exists to initialize some shared resources, configure tracing, and then provide the entry point to the Lambda Handler code.

In this sample repository, the main function will do just those things.  Notice that the [`TABLE_NAME`](focus://9[38:47]) environment variable is required as it'll be used when querying the DynamoDB table that supports the user customization.

We are also creating a [`shared_client`](focus://12[9:21]) which is a good best practice as the reference will be reused on each Lambda event that is handled.

```rust
#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    let table_name = &std::env::var("TABLE_NAME").expect("TABLE_NAME must be set");
    let config = aws_config::load_from_env().await;
    let client = Client::new(&config);
    let shared_client = &client;

    run(service_fn(
        move |event: LambdaEvent<CognitoEventUserPoolsPreTokenGenV2>| async move {
            function_handler(&shared_client, table_name, event).await
        },
    )).await
}

```

</CH.Section>

### Shared Code

Let's work through the shared code first because it'll be used extensively in the Lambda's handler implementation.

The shared library crate is comprised of two modules:

-   data: interacts with DynamoDB
-   models: defines shape and behaviors for the structs and enums

#### User Model

The primary model that we'll be working with is the User model.  It holds data that will be leveraged for customizing the two tokens.  It aslo has an implementation that helps with returning field values.  I find it's a good idea to hide the data implementation and provider accessors that are needed for the consumers of the crate.

<CH.Section>
The User model has [`macros`](focus://1) for handling serlialization, deserialization and debug functionality.  

The first_name, last_name and interesting_value will be used for the token but you could easily replace these values with your custom needs.

```rust
#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    id: String,
    user_id: String,
    first_name: String,
    last_name: String,
    interesting_value: String,
}

impl User {
    pub fn get_first_name(&self) -> String {
        String::from(&self.first_name)
    }

    pub fn get_last_name(&self) -> String {
        String::from(&self.last_name)
    }

    pub fn get_interesting_value(&self) -> String {
        String::from(&self.interesting_value)
    }
}
```

</CH.Section>

In addition to the User model, this mod contains an enum for custom errors.  Custom error handling in Rust allows the developer to organize failures into common conventions that provide cleaner Result values in addition to clarity in the interfaces.

#### DynamoDB Get Item

<CH.Section>
Working with DynamoDB is a breeze when paired with the AWS SDK for Rust.  In this example, we are going to execute a GetItemRequest which will fetch one item or return an empty resultset if not found.  We will be looking the User up by  the Partition Key (PK).

First thing this code is doing is building the PK value which is the string [`USER#`](focus://2[16:20]) added to the immutable unique identifier which matches up with the Cognito user_id.

The [`get_item`](focus://9[10:19]) function call expects an [`Option<HashMap<String,AttributeValue>>`](focus://3[18:48]) and a table name which is supplied in the function call.

```rust
pub async fn fetch_item(client: &Client, table_name: &str, id: &str) -> Result<User, QueryError> {
    let key = "USER#".to_owned() + id;
    let key_map: HashMap<String, AttributeValue> = [("id".to_string(), AttributeValue::S(key))]
        .iter()
        .cloned()
        .collect();

    match client
        .get_item()
        .table_name(table_name)
        .set_key(Some(key_map))
        .send()
        .await
    {
        Ok(result) => match result.item {
            None => Err(QueryError::NotFound),
            Some(item) => {
                let i: User = from_item(item)?;
                Ok(i)
            }
        },
        Err(e) => Err(e.into()),
    }
}
```

The result of querying DynamoDB will return a Result which can be checked for OK and Err in typical Rust fashion.  If the item is not found, we can return our custom [`QueryError::NotFound`](focus://16[25:44]).  However, if found, then we return the output of [`serde_dynamodb::from_item`](focus://18[30:39])

With a DynamoDB record transformed into a User model, let's have a look at the Lambda handler code.

</CH.Section>

### Handler Code

Going back to our handler code here's what it looks like.

<CH.Scrollycoding>

The [`Lambda`](focus://4[16:26]) struct is a templated implementation that takes a CognitoEventUserPoolsPreTokenGenV2.  This event struct has some convienence fieds on it that are useful for grabbing the user_name.

With the user_name, we can now execute the [`data::fetch_item`](focus://10[22:40]).  With a fetched User model, I can now start adding to the HashMaps.  Remember, we are customizing both the ID and the Access token here so we want 2 HashMaps; one for each.

With the ID and Access token HashMaps created, we can construct the structs that get returned back as a part of the CognitoEventUserPoolsPreTokenGenV2 Result.  The struct that is returned has a few other nested fields that need to be accounted for but before, but the following statement sets up the payload with the HashMap. [`let ovr = ClaimsAndScopeOverrideDetailsV2`](focus://39[5:48]).

And that's it, the payload can be returned to Cognito.

```rust
async fn function_handler(
    client: &Client,
    table_name: &String,
    mut event: LambdaEvent<CognitoEventUserPoolsPreTokenGenV2>,
) -> Result<CognitoEventUserPoolsPreTokenGenV2, Error> {
    let mut access = HashMap::new();
    let mut id = HashMap::new();
    match event.payload.cognito_event_user_pools_header.user_name {
        Some(ref user_name) => {
            let user = data::fetch_item(client, &table_name, user_name).await?;
            access.insert("interesting_value".to_string(), user.get_interesting_value());
            id.insert("first_name".to_string(), user.get_first_name());
            id.insert("last_name".to_string(), user.get_last_name());
        }
        None => {
            event
                .payload
                .response
                .claims_and_scope_override_details
                .as_mut()
                .unwrap()
                .group_override_details
                .groups_to_override = vec![];
        }
    }

    let access_token = CognitoAccessTokenGenerationV2 {
        claims_to_add_or_override: access,
        claims_to_suppress: vec![],
        scopes_to_add: vec![],
        scopes_to_suppress: vec![],
    };

    let id_token = CognitoIdTokenGenerationV2 {
        claims_to_add_or_override: id,
        claims_to_suppress: vec![],
    };

    let ovr = ClaimsAndScopeOverrideDetailsV2 {
        access_token_generation: Some(access_token),
        group_override_details: GroupConfiguration {
            ..Default::default()
        },
        id_token_generation: Some(id_token),
    };

    event.payload.response = CognitoEventUserPoolsPreTokenGenResponseV2 {
        claims_and_scope_override_details: Some(ovr),
    };

    Ok(event.payload)
}
```

</CH.Scrollycoding>


## Displaying the Output

With a successfully customized Access and ID token, they should look like the below implementations.

_Access Token_

![Customized Access Token](/img/patterns/security-patterns/acces_token_customized.png)

_ID Token_

![Customized ID Token](/img/patterns/security-patterns/id_token_customized.png)

## Congratulations

Congratulations, you now have a Rust Lambda Function that handles the Cognito Token Customization hook which allows overriding claims in the ID and Access Token!