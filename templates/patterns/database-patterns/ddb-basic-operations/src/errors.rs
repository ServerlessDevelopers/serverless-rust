use thiserror::Error;

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
