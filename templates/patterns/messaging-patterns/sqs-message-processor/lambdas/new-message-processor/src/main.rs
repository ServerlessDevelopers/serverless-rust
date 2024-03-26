use aws_lambda_events::sqs::{BatchItemFailure, SqsBatchResponse, SqsEvent};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use shared::{InternalSqsMessage, MessageParseError, NewMessage, NewMessageHandler};

async fn function_handler(event: LambdaEvent<SqsEvent>) -> Result<SqsBatchResponse, Error> {
    let mut batch_item_failures = Vec::new();

    for message in &event.payload.records {
        let message_id = message.message_id.clone().unwrap_or("".to_string());

        if message_id.len() == 0 {
            continue;
        }

        let new_message: Result<NewMessage, MessageParseError> = InternalSqsMessage::new(message.clone()).try_into();

        if new_message.is_err() {
            batch_item_failures.push(BatchItemFailure{
                item_identifier: message_id
            });
            continue;
        }

        // Business logic goes here
        let handle_result = NewMessageHandler::handle(&new_message.unwrap()).await;

        if handle_result.is_err() {
            batch_item_failures.push(BatchItemFailure{
                item_identifier: message_id
            });
            continue;
        }
    }

    Ok(SqsBatchResponse{
        batch_item_failures
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