mod model;

use axum::{
    routing::{get, post},
    http::StatusCode,
    Json, Router,
};
use axum::extract::Path;
use axum::routing::put;
use serde::{Deserialize, Serialize};
use crate::model::{Model, PostModel, PutModel, ViewModel};

async fn get_by_id(Path(id): Path<String>) -> Json<ViewModel> {
    println!("{id}");

    // execute the get in the DB
    let model = Model::new("New Model".to_string());
    // convert to a view model
    let view_model:ViewModel = model.into();

    Json(view_model)
}

async fn delete_by_id(Path(id): Path<String>) -> StatusCode {
    println!("{id}");

    // execute the delete in the DB

    StatusCode::NO_CONTENT
}

async fn create(request: Json<PostModel>) -> Json<ViewModel> {
    // convert to the model
    let model: Model = request.0.into();

    // do some work, save to DB
    // convert back to view model
    let view_model: ViewModel = model.into();

    Json(view_model)
}

async fn update(Path(id): Path<String>, request: Json<PutModel>) -> Json<ViewModel> {
    println!("{id}");
    // convert to the model
    let model: Model = request.0.into();

    // do some work, save to DB
    // convert back to view model
    let view_model: ViewModel = model.into();

    Json(view_model)
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    // initialize tracing
    tracing_subscriber::fmt::init();

    // build our application with a route
    let app = Router::new()
        .route("/", get(create))
        .route("/:id", get(get_by_id))
        .route("/:id", post(create))
        .route("/:id", put(update));

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}