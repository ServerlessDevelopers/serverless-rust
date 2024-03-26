use std::env;
use lambda_http::{run, service_fn, Error, IntoResponse, Request, Response};
use lambda_http::http::{HeaderMap, StatusCode};


async fn function_handler(
    allowed_origins: &str,
    event: Request,
) -> Result<impl IntoResponse, Error> {
    match get_origin(event.headers(), allowed_origins) {
        Some(origin) => {
            let response = Response::builder()
                .status(StatusCode::OK)
                .header("Access-Control-Allow-Origin", origin)
                .header("Access-Control-Allow-Headers", "Content-Type")
                .header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST, OPTIONS, PATCH")
                .body("".to_string())
                .map_err(Box::new)?;
            Ok(response)
        }
        None => {
            let response = Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .body("".to_string())
                .map_err(Box::new)?;
            Ok(response)
        }
    }
}

fn get_origin(headers: &HeaderMap, allowed_origins: &str) -> Option<String> {
    return match headers.get("origin") {
        Some(origin) => {
            let s = allowed_origins.split(',');
            for o in s {
                if o == origin {
                    return Some(o.to_string());
                }
            }

            None
        }
        None => {
            None
        }
    };
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .json()
        .init();

    let origins = env::var("ALLOWED_ORIGINS").expect("ALLOWED_ORIGINS must be set");
    let allowed_origins = &origins;

    run(service_fn(move |payload: Request| async move {
        function_handler(allowed_origins, payload).await
    })).await
}