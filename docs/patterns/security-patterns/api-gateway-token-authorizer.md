---
sidebar_position: 1
title: API Gateway Token Authorizer
description: Lambda function for authorizer an API Gateway request
keywords: [rust,lambda,api gateway,security]
---

Applications require security.  There isn't a debate here, they just do.  And serverless applications are no different.  One of the knocks against serverless is that it isn't secure.  That's 100% a false narrative.  However, serverless paired with Infrastructure as Code (IaC) can make it easy sometimes to ship things that do lack the proper controls.  

When building API-based solutions, AWS' API Gateway is a great way to shape traffic, mold payloads and integrate directly into other AWS services.  One thing that's not highlighted enough is custom API Authorizers powered by Lambda.  This article will discuss a template that shows how to build an API Gateway custom authorizer with Rust, because who doesn't want to prioritize safety and speed at the top an authorizer's list of requirements?

## How it Works

Each endpoint in API gateway gives the builder an option to require authorization on top of the request by way of Cognito, IAM or custom Lambda.  If you are using Cognito, you could make the argument that using the Cognito authorizer is the way to go.  But you are limited to the default integration.  By chooosing a custom Lambda authorizer, you can override the context that is supplied to proxy requests thus grabbing information that reduces further burden on downstream systems.

This article assumes that we are working with a Cognito generated JWT that could have been customized like in the pattern [shown here](./congito-token-customization.md).  

Using this pattern will save you CPU cycles, I/O requests and will give you a layer of security on top of your API Endpoints.

## Project Structure

 This starter project is organized around a single Lambda handler with a shared library crate can be used for the JSON Web Token (JWT) claims and models. 

 ```bash
 source/
    api-gateway-authorizer/
    shared/
 Cargo.toml
```

The template that this article will be working from can be found under the [./templates](https://github.com/jeastham1993/serverless-rust.github.io/tree/main/templates/patterns/security-patterns/api-gateway-authorizer) directory in the GitHub repo. You can use template to get started building with API Gateway Authorizers and Lambda.

## Lambda Code

This Lambda code is build around two points.

1.  The shared library that holds the models and where you can customize your business logic
2.  The main func and handler code for the Lambda

Let's start off by talking about the shared library.

### Shared Code

The shared code for this sample is not complex, but it's important to not that when working with JWT's, the deserialization and data types of the fields can be important.  Sure, there are ways around bad fields or mis-matched types, but if you are creating the JWT, you should have a really good understanding of what the payloads should look like.

<CH.Section>

The main two structs which will serves as models in this project are defined below.  The first struct called [`Claim`](focus://2[12:17]) includes macros for Serializing, Deserializing and Debug.  You'll notice that many of the fields seem standard in most Access tokens, because this example is working with an Access token.

```rust
#[derive(Serialize, Deserialize, Debug)]
pub struct Claim {
    pub auth_time: i64,
    client_id: String,
    event_id: String,
    exp: i64,
    iat: i64,
    iss: String,
    jti: String,
    #[serde(rename = "locationId")]
    location_id: String,
    origin_jti: String,
    scope: String,
    sub: String,
    token_use: String,
    username: String,
    roles: String
}

#[derive(Serialize, Deserialize, Debug)]
struct PrivateClaim {
    user_name: String,
    location_id: String,
    roles: String
}
```

This second struct is defining the [`PrivateClaim`](focus://21[8:19]) that we want to pass along in the context object of the authorization payload which I'll highlight in the handler code.

What will show up as we work further through this sample is that there are 3 fields that will are important be passed along and they are defined in the PrivateClaim struct.

</CH.Section>

<CH.Section>

The next piece that is in this library includes a custom error enumeration.  As with other samples is this website, custom errors in Rust are very powerful and help to be specific when defining interfaces.

```rust
#[derive(Debug, Error)]
pub enum AuthorizerError {
    #[error("Something is wrong with the Cognito portion of the JWT")]
    JWTCognitoError,
    #[error("The JSON was bad.  The serde failed.")]
    InvalidSerde,
    #[error("The JWT is invalid")]
    InvalidJWT,
}

impl From<jsonwebtokens::error::Error> for AuthorizerError {
    fn from(_: jsonwebtokens::error::Error) -> Self {
        AuthorizerError::InvalidJWT
    }
}

impl From<serde_json::Error> for AuthorizerError {
    fn from(_: serde_json::Error) -> Self {
        AuthorizerError::InvalidSerde
    }
}

impl From<jsonwebtokens_cognito::Error> for AuthorizerError {
    fn from(_: jsonwebtokens_cognito::Error) -> Self {
        AuthorizerError::JWTCognitoError
    }
}
```
</CH.Section>

<CH.Section>

The last piece of this shared library is to look into the [`dump_claims`](focus://1) function.  The purpose is this it to take the value from the JWT claims and fill out the PrivateClaim struct as defined above.  This PrivateClaim is then used as context in subsequent API requests.

```rust
pub fn dump_claims(value: &serde_json::Value) -> Result<serde_json::Value, serde_json::Error> {
    let claim: Result<Claim, serde_json::Error> = serde_json::from_value(value.clone());

    match claim {
        Ok(c) => {
            let pc = PrivateClaim {
                user_name: c.username,
                location_id: c.location_id,
                roles: c.roles
            };
            let pc_v = serde_json::to_value(pc)?;
            Ok(pc_v)
        }
        Err(e) => {
            Err(e)
        }
    }
}
```

</CH.Section>

### Lambda Handler

With the shared library code all in place, we can move onto the Lambda's main function and its handler.

<CH.Scrollycoding>

The Lambda handler code is setup by the [`main`](focus://38) function which initializes a few key pieces of this puzzle.  The main points to pay attention to are these:

1.  Main includes the Tokio Macro for running it asynchronously.
2.  The [`USER_POOL_ID`](focus://45[38:51]) is needed for fetching the JSON Web Key Sets (JWKS)
3.  The [`CLIENT_ID`](focus://46[37:45]) is also needed for fetching the JSON Web Key Sets (JWKS)
4.  The fetched JWKS are then shared with each Lambda invocation

With the main function built, let's move onto the [`function_handler`](focus://1)

The handler follows down one of two paths.  It will build a verifier, which it then uses to validate the actual bearer token that is supplied in.  If the token is valid, matches one of the keys in the key set, it is then passed into the [`dump_claims`](focus://20[32:42]) function.

If at any point in this flow an error is encountered or data is missing, then the request is marked as "Deny".  That allowance is then passed back to the API Gateway which will then either Allow or Deny based upon how the handler evaluated the JWT.  And when the allowance is Allow, the context that is built from the shared library's dump_claims will be passed along as well.

That response is built from [`new_response`](focus://59)

```rust
async fn function_handler(
    client_id: &str,
    key_set: &jsonwebtokens_cognito::KeySet,
    event: LambdaEvent<ApiGatewayCustomAuthorizerRequest>,
) -> Result<ApiGatewayCustomAuthorizerResponse, AuthorizerError> {
    let mut allowance = "Allow";
    let mut ctx = serde_json::Value::default();

    let verifier = key_set.new_access_token_verifier(&[client_id]).build()?;
    let token = event.payload.authorization_token.unwrap();
    let bearer = "Bearer ";

    match token.starts_with(bearer) {
        true => {
            let stripped_token = token.replace(bearer, "");
            let claims: Result<serde_json::Value, jsonwebtokens_cognito::Error> =
                key_set.try_verify(stripped_token.as_str(), &verifier);

            match claims {
                Ok(c) => ctx = dump_claims(&c)?,
                Err(e) => {
                    error!("Error dumping claims: {:?}", e);
                    allowance = "Deny";
                }
            }
        }
        false => {
            error!("Error no Bearer prefix");
            allowance = "Deny";
        }
    }

    let response = new_response(allowance, ctx);
    Ok(response)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    let user_pool_id = &std::env::var("USER_POOL_ID").expect("USER_POOL_ID must be set");
    let client_id = &std::env::var("CLIENT_ID").expect("CLIENT_ID must be set");
    let key_set = jsonwebtokens_cognito::KeySet::new("us-west-2", user_pool_id).unwrap();
    let _ = key_set.prefetch_jwks().await;
    let shared_key_set = &key_set;

    run(service_fn(
        move |event: LambdaEvent<ApiGatewayCustomAuthorizerRequest>| async move {
            function_handler(client_id, &shared_key_set, event).await
        },
    ))
    .await
}

fn new_response(effect: &str, ctx: serde_json::Value) -> ApiGatewayCustomAuthorizerResponse {
    ApiGatewayCustomAuthorizerResponse {
        principal_id: None,
        policy_document: ApiGatewayCustomAuthorizerPolicy {
            version: Some("2012-10-17".to_owned()),
            statement: vec![IamPolicyStatement {
                effect: Some(effect.to_owned()),
                resource: vec!["*".to_owned()],
                action: vec!["execute-api:Invoke".to_owned()],
            }],
        },
        usage_identifier_key: None,
        context: ctx,
    }
}

```

</CH.Scrollycoding>

## Congratulations

Congratulations, you now have a Lambda Function that will work as a custom authorizer that can be plugged into an API Gateway.  And this Lambda is coded in Rust, so you can rest assured, it is secure and blazing fast!