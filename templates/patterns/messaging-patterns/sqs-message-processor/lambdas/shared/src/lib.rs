use aws_lambda_events::sqs::SqsMessage;
use serde::{Deserialize};
use serde_json::Error;

#[derive(Debug)]
pub enum MessageParseError{
    EmptyMessageBody,
    CannotDeserialize
}

pub struct InternalSqsMessage{
    message: SqsMessage
}

impl InternalSqsMessage{
    pub fn new(message: SqsMessage) -> Self {
        Self {
            message
        }
    }
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewMessage {
    pub order_id: String
}

pub struct NewMessageHandler {}

impl NewMessageHandler {
    pub async fn handle(message: &NewMessage) -> Result<(), ()> {
        tracing::info!("New message is for {}", message.order_id);

        Ok(())
    }
}

impl TryFrom<InternalSqsMessage> for NewMessage {
    type Error = MessageParseError;

    fn try_from(value: InternalSqsMessage) -> Result<Self, Self::Error> {
        match value.message.body {
            None => Err(MessageParseError::EmptyMessageBody),
            Some(body) => {
                let parsed_body: NewMessage = serde_json::from_str(body.as_str())?;

                Ok(parsed_body)
            }
        }
    }
}

impl From<Error> for MessageParseError {
    fn from(value: Error) -> Self {
        MessageParseError::CannotDeserialize
    }
}