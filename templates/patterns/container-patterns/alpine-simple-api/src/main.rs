use axum::{routing::get, Router, Json};
use serde::Serialize;

#[derive(Serialize)]
struct Resource {
    key: String,
    value: String,
}

#[tokio::main]
async fn main() {
    // build our application with a route
    let app = Router::new()
        .route("/", get(handler))
        .route("/health", get(health));

    // run it
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080")
        .await
        .unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn handler() -> Json<Resource> {
    let r = Resource {
        key: "key".to_string(),
        value: "value".to_string()
    };

    Json(r)
}

async fn health() -> Json<Resource> {
    let r = Resource {
        key: "healthy".to_string(),
        value: "healthy".to_string()
    };

    Json(r)
}