use lambda_http::{Error, http::Response, IntoResponse, Request, RequestPayloadExt, run, service_fn};

use shared::{ApplicationError, CreateOrderCommand, CreateOrderCommandHandler, OrderRepository};

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

    let command_handler = CreateOrderCommandHandler::new(repository);

    run(service_fn(|evt| {
        handler(&command_handler, evt)
    })).await
}

async fn handler(command_handler: &CreateOrderCommandHandler, event: Request) -> Result<impl IntoResponse, Error> {
    let body = event.payload::<CreateOrderCommand>();
    
    match body {
        Ok(item) => {
            match item {
                Some(i) => {
                    let handler_result = command_handler.handle(i).await;

                    let resp = match handler_result {
                        Ok(order) => {
                            let serde_model = serde_json::to_string(&order)?;
                            Response::builder()
                            .status(201)
                            .header("content-type", "application/json")
                            .body(serde_model)
                            .map_err(Box::new)?
                        }
                        Err(_) => Response::builder()
                            .status(400)
                            .header("content-type", "application/json")
                            .body("".to_string())
                            .map_err(Box::new)?
                    };

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