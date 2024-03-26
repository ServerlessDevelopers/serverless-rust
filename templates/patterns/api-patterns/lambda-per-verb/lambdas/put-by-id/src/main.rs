use lambda_http::{Error, IntoResponse, Request, service_fn, run, Response, Body, RequestPayloadExt, RequestExt};
use tracing::info;
use shared::{Model, PostModel, PutModel, ViewModel};

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
    // get the path parameter
    let id = event
        .path_parameters_ref()
        .and_then(|params| params.first("id"))
        .unwrap();
    info!("id: {:?}", id);

    let body = event.payload::<PutModel>();

    match body {
        Ok(item) => {
            match item {
                Some(i) => {
                    // convert to the model
                    let model: Model = i.into();
                    // do some work
                    // convert back to view model
                    let view_model: ViewModel = model.into();
                    let serde_model = serde_json::to_string(&view_model)?;
                    let resp = Response::builder()
                        .status(200)
                        .header("content-type", "text/json")
                        .body(serde_model)
                        .map_err(Box::new)?;
                    Ok(resp)
                }
                None => {
                    let resp = Response::builder()
                        .status(400)
                        .header("content-type", "text/json")
                        .body("".to_string())
                        .map_err(Box::new)?;
                    Ok(resp)
                }
            }
        }
        Err(e) => {
            let resp = Response::builder()
                .status(400)
                .header("content-type", "text/json")
                .body(e.to_string())
                .map_err(Box::new)?;
            Ok(resp)
        }
    }
}