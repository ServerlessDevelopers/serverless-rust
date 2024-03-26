use tracing_subscriber::filter::{EnvFilter, LevelFilter};
use aws_lambda_events::event::dynamodb::Event;use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use tracing::info;
use crate::models::SampleModel;

mod models;

async fn function_handler(event: LambdaEvent<Event>) -> Result<(), Error> {
    info!("(BatchSize)={:?}", event.payload.records.len());
    // Extract some useful information from the request
    for record in event.payload.records {
        let m: SampleModel = record.change.new_image.into();
        info!("(Sample)={:?}", m);
    }

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive(LevelFilter::INFO.into())
                .from_env_lossy(),
        )
        .json()
        .with_target(false)
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}
