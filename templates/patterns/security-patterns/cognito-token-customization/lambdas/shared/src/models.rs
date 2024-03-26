use serde::{Deserialize, Serialize};
use thiserror::Error;
use tracing::error;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    id: String,
    user_id: String,
    first_name: String,
    last_name: String,
    interesting_value: String,
}

impl User {
    pub fn get_first_name(&self) -> String {
        String::from(&self.first_name)
    }

    pub fn get_last_name(&self) -> String {
        String::from(&self.last_name)
    }

    pub fn get_interesting_value(&self) -> String {
        String::from(&self.interesting_value)
    }
}

#[derive(Error, Debug)]
pub enum QueryError {
    #[error("failed to parse response into a user: {0}")]
    SerdeError(serde_dynamo::Error),
    #[error("aws_sdk_dynamodb error: {0}")]
    DynamoError(aws_sdk_dynamodb::Error),
    #[error("aws_sdk_dynamodb::error:: error: {0}")]
    DynamoSdkError(String),
    #[error("item not found")]
    NotFound,
}

impl From<aws_sdk_dynamodb::Error> for QueryError {
    fn from(err: aws_sdk_dynamodb::Error) -> Self {
        QueryError::DynamoError(err)
    }
}

impl From<serde_dynamo::Error> for QueryError {
    fn from(err: serde_dynamo::Error) -> Self {
        QueryError::SerdeError(err)
    }
}

impl<E, R> From<aws_sdk_dynamodb::error::SdkError<E, R>> for QueryError
    where
        E: std::fmt::Debug,
        R: std::fmt::Debug,
{
    fn from(err: aws_sdk_dynamodb::error::SdkError<E, R>) -> Self {
        QueryError::DynamoSdkError(std::format!("{:?}", err))
    }
}
