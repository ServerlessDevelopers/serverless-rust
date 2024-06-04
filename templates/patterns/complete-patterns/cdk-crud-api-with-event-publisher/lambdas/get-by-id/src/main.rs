use lambda_http::{Error, IntoResponse, Request, service_fn, run, Response, RequestExt};
use shared::{ApplicationError, GetOrderQuery, GetOrderQueryHandler, OrderRepository};

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

    let query_handler = GetOrderQueryHandler::new(repository);

    run(service_fn(|evt| {
        handler(&query_handler, evt)
    })).await
}

async fn handler(query_handler: &GetOrderQueryHandler, event: Request) -> Result<impl IntoResponse, Error> {
    let order_id = event
        .path_parameters_ref()
        .and_then(|params| params.first("orderId"))
        .unwrap_or_else(|| "");
    let customer_id = event
        .path_parameters_ref()
        .and_then(|params| params.first("customerId"))
        .unwrap_or_else(|| "");

    let res = query_handler.handle(GetOrderQuery{
        order_id: order_id.to_string(),
        customer_id: customer_id.to_string()
    }).await;

    let resp = match res {
        Ok(order) => {
            let serde_model = serde_json::to_string(&order)?;
            Response::builder()
                .status(200)
                .header("content-type", "application/json")
                .body(serde_model)
                .map_err(Box::new)?
        }
        Err(err_type) => match err_type {
            ApplicationError::OrderNotFound(_) => Response::builder()
                .status(404)
                .header("content-type", "application/json")
                .body("".to_string())
                .map_err(Box::new)?,
            _ => {
                tracing::info!("{}", err_type);
                Response::builder()
                    .status(500)
                    .header("content-type", "application/json")
                    .body("".to_string())
                    .map_err(Box::new)?
            }
        }
    };


    Ok(resp)
}