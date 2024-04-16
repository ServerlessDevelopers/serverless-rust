use aws_lambda_events::cloudwatch_events::CloudWatchEvent;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use shared::{MessageParseError, Payload, PayloadHandler};

async fn function_handler(event: LambdaEvent<CloudWatchEvent>) -> Result<(), Error> {
    let payload: Result<Payload, MessageParseError> = InternalMessage(event.payload).try_into();

    match payload {
        Ok(payload) => {
            let _handle_res = PayloadHandler::handle(&payload).await;

            match _handle_res {
                Ok(_) => Ok(()),
                Err(e) => Err(e.into())
            }
        }
        Err(err) => {
            Err(err.into())
        }
    }
}

pub struct InternalMessage(CloudWatchEvent);

impl TryFrom<InternalMessage> for Payload {
    type Error = MessageParseError;

    fn try_from(value: InternalMessage) -> Result<Self, Self::Error> {
        match value.0.detail {
            None => Err(MessageParseError::EmptyMessageBody),
            Some(body) => {
                let payload: Result<Payload, serde_json::error::Error> = serde_json::from_value(body);

                match payload {
                    Ok(payload) => Ok(payload),
                    Err(_) => Err(MessageParseError::CannotDeserialize)
                }
            }
        }
    }
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