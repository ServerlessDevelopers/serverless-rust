use aws_lambda_events::kinesis::KinesisEvent;
use aws_lambda_events::streams::{KinesisBatchItemFailure, KinesisEventResponse};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use shared::{InternalKinesisMessage, MessageParseError, NewSensorReading, NewSensorReadingHandler};

async fn function_handler(event: LambdaEvent<KinesisEvent>) -> Result<KinesisEventResponse, Error> {
    let mut batch_item_failures = Vec::new();

    for message in &event.payload.records {
        let kinesis_sequence_number = message.kinesis.sequence_number.clone();

        let new_message: Result<NewSensorReading, MessageParseError> = InternalKinesisMessage::new(message.clone()).try_into();

        if new_message.is_err() {
            batch_item_failures.push(KinesisBatchItemFailure{
                item_identifier: kinesis_sequence_number
            });
            continue;
        }

        // Business logic goes here
        let handle_result = NewSensorReadingHandler::handle(&new_message.unwrap()).await;

        if handle_result.is_err() {
            batch_item_failures.push(KinesisBatchItemFailure{
                item_identifier: kinesis_sequence_number
            });
            continue;
        }
    }

    Ok(KinesisEventResponse{
        batch_item_failures,
    })
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}