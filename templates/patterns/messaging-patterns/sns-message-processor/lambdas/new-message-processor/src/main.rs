use aws_lambda_events::sns::SnsEvent;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use shared::{InternalSnsMessage, MessageParseError, OrderCreatedMessage, OrderCreatedMessageHandler};

async fn function_handler(event: LambdaEvent<SnsEvent>) -> Result<(), String> {
    for message in &event.payload.records {
        let new_message: Result<OrderCreatedMessage, MessageParseError>
            = InternalSnsMessage::new(message.clone()).try_into();

        if new_message.is_err(){
            return Err("Failure deserializing message body".to_string());
        }

        let _ = OrderCreatedMessageHandler::handle(&new_message.unwrap()).await?;
    }

    Ok(())
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