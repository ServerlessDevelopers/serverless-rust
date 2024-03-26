use aws_lambda_events::kinesis::{KinesisEventRecord};
use serde::{Deserialize};
use serde_json::Error;

#[derive(Debug)]
pub enum MessageParseError{
    EmptyMessageBody,
    CannotDeserialize
}

pub struct InternalKinesisMessage{
    message: KinesisEventRecord
}

impl InternalKinesisMessage{
    pub fn new(message: KinesisEventRecord) -> Self {
        Self {
            message
        }
    }
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewSensorReading {
    pub temperature: f64,
    pub reading_timestamp: i64
}

pub struct NewSensorReadingHandler {}

impl NewSensorReadingHandler {
    pub async fn handle(message: &NewSensorReading) -> Result<(), ()> {
        tracing::info!("New message is for temperature {} at time {}", message.temperature, message.reading_timestamp);

        if message.temperature > 100.00 {
            return Err(());
        }

        Ok(())
    }
}

impl TryFrom<InternalKinesisMessage> for NewSensorReading {
    type Error = MessageParseError;

    fn try_from(value: InternalKinesisMessage) -> Result<Self, Self::Error> {
        let parsed_body: NewSensorReading = serde_json::from_slice(value.message.kinesis.data.0.as_slice())?;

        Ok(parsed_body)
    }
}

impl From<Error> for MessageParseError {
    fn from(_value: Error) -> Self {
        MessageParseError::CannotDeserialize
    }
}