use std::env;

use aws_sdk_eventbridge::{
    error::SdkError,
    operation::put_events::{PutEventsError, PutEventsOutput},
};
use lambda_http::{run, service_fn, Error, IntoResponse, Request, Response};
use serde_json::json;
use tracing::info;

#[derive(serde::Deserialize, serde::Serialize)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
pub struct Payload {
    name: String,
    message: String,
}


async fn send_to_event_bridge(
    client: &aws_sdk_eventbridge::Client,
    payload: &Payload,
    bus_name: &str,
) -> Result<PutEventsOutput, SdkError<PutEventsError>> {
    let detail_type = "rust-demo".to_string();
    let s = serde_json::to_string(&payload).expect("Error serde");
    let request = aws_sdk_eventbridge::types::builders::PutEventsRequestEntryBuilder::default()
        .set_source(Some(String::from("RustDemo")))
        .set_detail_type(Some(detail_type))
        .set_detail(Some(String::from(s)))
        .set_event_bus_name(Some(bus_name.into()))
        .build();
    client.put_events().entries(request).send().await
}

/// This is the main body for the function. Verifys that a request was made with a
/// body and then forwards that Body to EventBridge
async fn function_handler(
    bus_name: &str,
    client: &aws_sdk_eventbridge::Client,
    event: Request,
) -> Result<impl IntoResponse, Error> {
    let mut status_code = 200;
    let mut response_body = "Good Request";

    let body = event.body();
    let body_string = std::str::from_utf8(body).expect("Body wasn't supplied");
    let payload: Result<Payload, serde_json::Error> = serde_json::from_str(body_string);

    match payload {
        Ok(payload) => match send_to_event_bridge(client, &payload, bus_name).await {
            Ok(_) => info!("Successfully posted to EventBridge"),
            Err(_) => {
                status_code = 400;
                response_body = "Bad Request";
            }
        },
        Err(_) => {
            status_code = 400;
            response_body = "Bad Request";
        }
    }
    {}

    let response = Response::builder()
        .status(status_code)
        .header("Content-Type", "application/json")
        .body(
            json!({
              "message": response_body,
            })
                .to_string(),
        )
        .map_err(Box::new)?;

    Ok(response)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .json()
        .init();

    let config = aws_config::load_from_env().await;
    let client = aws_sdk_eventbridge::Client::new(&config);
    let shared_client: &aws_sdk_eventbridge::Client = &client;

    let bus_name = env::var("EVENT_BUS_NAME").expect("EVENT_BUS_NAME must be set");
    let cloned_bus_name = &bus_name.as_str();
    run(service_fn(move |payload: Request| async move {
        function_handler(cloned_bus_name, shared_client, payload).await
    }))
        .await
}