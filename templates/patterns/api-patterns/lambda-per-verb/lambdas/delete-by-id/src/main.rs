use lambda_http::{Error, IntoResponse, Request, service_fn, run, Response, Body, RequestPayloadExt, RequestExt};
use tracing::info;
use shared::{Model, ViewModel};

#[tokio::main]
async fn main() -> Result<(), Error>{
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(handler)).await
}

async fn handler(event: Request) -> Result<impl IntoResponse, Error> {
    let id = event
        .path_parameters_ref()
        .and_then(|params| params.first("id"))
        .unwrap();
    info!("id: {:?}", id);

    // execute the delete in the DB

    let resp = Response::builder()
        .status(204)
        .header("content-type", "text/json")
        .body("".to_string())
        .map_err(Box::new)?;
    Ok(resp)
}