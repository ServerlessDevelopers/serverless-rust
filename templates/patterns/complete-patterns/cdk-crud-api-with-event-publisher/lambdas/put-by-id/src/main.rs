use lambda_http::{Error, IntoResponse, Request, RequestPayloadExt, Response, run, service_fn};
use lambda_http::http::StatusCode;

use shared::{ApplicationError, OrderRepository, UpdateOrderCommand, UpdateOrderCommandHandler};

#[tokio::main]
async fn main() -> Result<(), Error>{
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    let repository = OrderRepository::new(false).await.map_err(|_| {
        ApplicationError::TableNameNotSet()
    })?;

    let command_handler = UpdateOrderCommandHandler::new(repository);

    run(service_fn(|req| {
        handler(&command_handler, req)
    }) ).await
}

async fn handler(command_handler: &UpdateOrderCommandHandler, event: Request) -> Result<impl IntoResponse, Error> {
    let item = event.payload::<UpdateOrderCommand>()?;

    let resp = match item {
        Some(i) => {
            let handler_result = command_handler.handle(i).await;

            let resp = match handler_result {
                Ok(order) => {
                    let serde_model = serde_json::to_string(&order)?;
                    generate_response(201, serde_model)
                }
                Err(_) => generate_response(500, "".to_string())
            };
            resp
        }
        None => {
            let resp = generate_response(400, "".to_string());

            resp
        }
    };

    resp
}

fn generate_response(status: u16, body: String) -> Result<Response<String>, Error> {
    let response = Response::builder()
        .status(StatusCode::from_u16(status).unwrap())
        .header("content-type", "application/json")
        .body(body)
        .map_err(Box::new)?;

    Ok(response)
}