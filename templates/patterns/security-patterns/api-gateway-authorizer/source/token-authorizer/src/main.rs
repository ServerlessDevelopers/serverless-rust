use aws_lambda_events::apigw::{
    ApiGatewayCustomAuthorizerPolicy, ApiGatewayCustomAuthorizerRequest,
    ApiGatewayCustomAuthorizerResponse, IamPolicyStatement,
};

use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use tracing::{debug, error};
use tracing_subscriber::{
    layer::SubscriberExt as _, util::SubscriberInitExt as _, EnvFilter, Layer,
};
use shared::{AuthorizerError, dump_claims};


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
