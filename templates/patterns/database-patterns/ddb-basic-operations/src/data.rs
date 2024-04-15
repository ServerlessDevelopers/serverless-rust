use aws_sdk_dynamodb::Client;
use aws_sdk_dynamodb::types::AttributeValue;
use tracing::error;
use crate::errors::QueryError;
use crate::models::BasicEntity;

pub async fn create_item(
    client: &Client,
    table_name: &str,
    item: BasicEntity,
) -> Result<BasicEntity, QueryError> {
    let _ = client
        .put_item()
        .item("id".to_string(), AttributeValue::S(item.get_id()))
        .item("name".to_string(), AttributeValue::S(item.get_name()))
        .item(
            "description".to_string(),
            AttributeValue::S(item.get_description()),
        )
        .item(
            "entity_type".to_string(),
            AttributeValue::S(item.get_entity_type()),
        )
        .item(
            "updated_at".to_string(),
            AttributeValue::N(item.get_updated_at().to_string()),
        )
        .item(
            "created_at".to_string(),
            AttributeValue::N(item.get_created_at().to_string()),
        )
        .table_name(table_name)
        .send()
        .await?;

    Ok(item)
}

pub async fn get_item(client: &Client, table_name: &str, id: &str) -> Result<BasicEntity, QueryError> {
    let output = client
        .get_item()
        .key("id".to_string(), AttributeValue::S(id.to_string()))
        .table_name(table_name)
        .send()
        .await?;

    match output.item {
        Some(item) => {
            let i: BasicEntity = serde_dynamo::from_item(item).unwrap();
            Ok(i)
        },

        None => {
            Err(QueryError::NotFound)
        }
    }
}

pub async fn update_item(client: &Client, table_name: &str, id: &str, timestamp: i64) -> Result<(), QueryError> {
    let _ = client
        .update_item()
        .table_name(table_name)
        .key("id", AttributeValue::S(id.to_string()))
        .update_expression("set updated_at = :updated_at")
        .expression_attribute_values(
            ":updated_at",
            AttributeValue::N(timestamp.to_string()),
        )
        .send()
        .await?;

    Ok(())
}

pub async fn delete_item(client: &Client, table_name: &str, id: &str) -> Result<(), QueryError> {
    let output = client
        .delete_item()
        .key("id".to_string(), AttributeValue::S(id.to_string()))
        .table_name(table_name)
        .return_values(aws_sdk_dynamodb::types::ReturnValue::AllOld)
        .send()
        .await?;

    match output.attributes() {
        Some(_) => Ok(()),
        None => Err(QueryError::NotFound),
    }
}

pub async fn get_items(
    client: &Client,
    table_name: &str,
    limit: i32
) -> Result<Vec<BasicEntity>, QueryError> {

    let output = client
        .scan()
        .limit(limit)
        .table_name(table_name)
        .send()
        .await?;

    match output.items {
        Some(item) => {
            let mut entities: Vec<BasicEntity> = Vec::new();

            for i in item {
                let entity: Result<BasicEntity, serde_dynamo::Error> = serde_dynamo::from_item(i);
                match entity {
                    Ok(entity) => {
                        entities.push(BasicEntity::from(entity));
                    }
                    Err(e) => {
                        error!("(Error)={:?}", e);
                    }
                }
            }

            Ok(entities)
        }
        None => {
            Ok(Vec::new())
        }
    }
}

