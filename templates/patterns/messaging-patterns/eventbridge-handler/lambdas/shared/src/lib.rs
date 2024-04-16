use std::fmt::{Display, Formatter};
use serde_json::Error;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum MessageParseError{
    EmptyMessageBody,
    CannotDeserialize
}

impl Display for MessageParseError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "")
    }
}

#[derive(Debug, Error)]
pub enum HandlerError{
    UnexpectedFailure,
}

impl Display for HandlerError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "")
    }
}

#[derive(serde::Deserialize, serde::Serialize)]
#[serde(rename_all = "camelCase")]
#[allow(dead_code)]
pub struct Payload {
    name: String,
    message: String,
}

pub struct PayloadHandler {}

impl PayloadHandler {
    pub async fn handle(message: &Payload) -> Result<(), HandlerError> {
        tracing::info!("New message is for '{}' with a message of '{}'", message.name, message.message);

        Ok(())
    }
}

impl From<Error> for MessageParseError {
    fn from(_value: Error) -> Self {
        MessageParseError::CannotDeserialize
    }
}