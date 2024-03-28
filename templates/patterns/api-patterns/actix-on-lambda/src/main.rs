mod model;

use actix_web::{middleware, web, App, HttpRequest, HttpServer, HttpResponse};
use actix_web::web::{delete, get, Json, Path, post};
use crate::model::{Model, PostModel, PutModel, ViewModel};

async fn get_by_id(path: Path<String,>) -> HttpResponse {
    let id = path.into_inner();
    println!("{id}");

    // execute the get in the DB
    let model = Model::new("New Model".to_string());
    // convert to a view model
    let view_model:ViewModel = model.into();

    HttpResponse::Ok().json(view_model)
}

async fn delete_by_id(path: Path<String,>) -> HttpResponse {
    let id = path.into_inner();

    println!("{id}");

    // execute the delete in the DB
    HttpResponse::NoContent().finish()
}

async fn create(request: Json<PostModel>) -> HttpResponse {
    // convert to the model
    let model: Model = request.0.into();

    // do some work, save to DB
    // convert back to view model
    let view_model: ViewModel = model.into();

    HttpResponse::Ok().json(view_model)
}

async fn update(path: Path<String,>, request: Json<PutModel>) -> HttpResponse {
    let id = path.into_inner();

    println!("{id}");
    // convert to the model
    let model: Model = request.0.into();

    // do some work, save to DB
    // convert back to view model
    let view_model: ViewModel = model.into();

    HttpResponse::Ok().json(view_model)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    log::info!("starting HTTP server at http://localhost:8080");

    HttpServer::new(|| {
        App::new()
            // enable logger
            .wrap(middleware::Logger::default())
            .service(web::resource("/")
                .route(post().to(create)))
            .service(web::resource("/{id}")
                .route(get().to(get_by_id))
                .route(delete().to(delete_by_id))
            )
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}