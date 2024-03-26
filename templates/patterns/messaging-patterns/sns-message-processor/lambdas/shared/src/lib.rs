use aws_lambda_events::sns::{SnsRecord};
use serde::{Deserialize};
use serde_json::Error;

#[derive(Debug)]
pub enum MessageParseError{
    EmptyMessageBody,
    CannotDeserialize
}

pub struct InternalSnsMessage{
    message: SnsRecord
}

impl InternalSnsMessage{
    pub fn new(message: SnsRecord) -> Self {
        Self {
            message
        }
    }
}

#[derive(Debug)]
pub enum OrderCreatedMessageHandleError{
    UnexpectedError
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct OrderCreatedMessage {
    pub order_id: String
}

pub struct OrderCreatedMessageHandler {}

impl OrderCreatedMessageHandler {
    pub async fn handle(message: &OrderCreatedMessage) -> Result<(), OrderCreatedMessageHandleError> {
        tracing::info!("New message is for {}", message.order_id);

        if message.order_id == "error" {
            return Err(OrderCreatedMessageHandleError::UnexpectedError);
        }

        Ok(())
    }
}

impl TryFrom<InternalSnsMessage> for OrderCreatedMessage {
    type Error = MessageParseError;

    fn try_from(value: InternalSnsMessage) -> Result<Self, Self::Error> {
        let parsed_body: OrderCreatedMessage = serde_json::from_str(value.message.sns.message.as_str())?;

        Ok(parsed_body)
    }
}

impl From<Error> for MessageParseError {
    fn from(_: Error) -> Self {
        MessageParseError::CannotDeserialize
    }
}

impl From<OrderCreatedMessageHandleError> for String {
    fn from(_: OrderCreatedMessageHandleError) -> Self {
        "Failure handling message".to_string()
    }
}