use std::collections::HashMap;

use super::models::{QueryError, User};
use aws_sdk_dynamodb::{types::AttributeValue, Client};
use serde_dynamo::aws_sdk_dynamodb_1::from_item;

pub async fn fetch_item(client: &Client, table_name: &str, id: &str) -> Result<User, QueryError> {
    let key = "USER#".to_owned() + id;
    let key_map: HashMap<String, AttributeValue> = [("id".to_string(), AttributeValue::S(key))]
        .iter()
        .cloned()
        .collect();

    match client
        .get_item()
        .table_name(table_name)
        .set_key(Some(key_map))
        .send()
        .await
    {
        Ok(result) => match result.item {
            None => Err(QueryError::NotFound),
            Some(item) => {
                let i: User = from_item(item)?;
                Ok(i)
            }
        },
        Err(e) => Err(e.into()),
    }
}
