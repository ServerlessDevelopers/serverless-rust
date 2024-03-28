mod model;

use std::borrow::Cow;
use std::sync::Mutex;
use rocket::{delete, get, launch, post, put, routes};
use rocket::serde::json::Json;
use rocket::response::status;
use rocket::response::status::{Accepted, NoContent};
use tracing::info;
use crate::model::{Model, PostModel, PutModel, ViewModel};

#[get("/<id>")]
fn get_by_id(id: &str) -> Json<ViewModel> {
    info!("id: {:?}", id);

    // execute the get in the DB

    let model = Model::new("New Model".to_string());
    // convert to a view model
    let view_model:ViewModel = model.into();

    Json(view_model)
}

#[delete("/<id>")]
fn delete_by_id(id: &str) -> status::NoContent {
    info!("deleting id: {:?}", id);

    // execute the delete in the DB

    NoContent
}

#[post("/", format = "json", data = "<request>")]
fn create(request: Json<PostModel>) -> Json<ViewModel> {
    // convert to the model
    let model: Model = request.0.into();
    // do some work, save to DB
    // convert back to view model
    let view_model: ViewModel = model.into();

    Json(view_model)
}

#[put("/<id>", format = "json", data = "<request>")]
fn update_by_id(id: &str, request: Json<PutModel>) -> Json<ViewModel> {
    // convert to the model
    let model: Model = request.0.into();
    // do some work, save to DB
    // convert back to view model
    let view_model: ViewModel = model.into();

    Json(view_model)
}

#[launch]
fn rocket() -> _ {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    rocket::build()
        .mount("/", routes![get_by_id, delete_by_id, create, update_by_id])
}