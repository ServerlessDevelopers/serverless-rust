mod view_models;
mod create_order_command;
mod update_order_command;
mod get_order_query;
mod delete_order_command;

pub use view_models::OrderViewModel;
pub use create_order_command::{CreateOrderCommand, CreateOrderCommandHandler};
pub use update_order_command::{UpdateOrderCommand, UpdateOrderCommandHandler};
pub use get_order_query::{GetOrderQuery, GetOrderQueryHandler};
pub use delete_order_command::{DeleteOrderCommand, DeleteOrderCommandHandler};

use std::env::VarError;
use std::fmt;
use aws_config::meta::region::RegionProviderChain;
use aws_config::Region;
use aws_sdk_dynamodb::Client;
use aws_sdk_dynamodb::error::ProvideErrorMetadata;
use aws_sdk_dynamodb::types::AttributeValue;
use uuid::Uuid;
use thiserror::Error;

#[derive(Debug)]
pub enum DatabaseKeys {
    PK,
    SK,
    Data,
    Type
}

impl fmt::Display for DatabaseKeys {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

#[derive(Error, Debug)]
pub enum ApplicationError {
    #[error("Order not found with orderId '{0}'")]
    OrderNotFound(String),
    #[error("Error with database: {0}")]
    DatabaseError(String),
    #[error("Table Name not set")]
    TableNameNotSet(),
}

impl From<VarError> for ApplicationError {
    fn from(_: VarError) -> Self {
        ApplicationError::TableNameNotSet()
    }
}

struct Order {
    order_id: String,
    customer_id: String,
    other_order_data: String
}

impl Order{
    pub fn new (customer_id: String, other_order_data: String) -> Self {
        Self {
            customer_id,
            order_id: Uuid::new_v4().to_string(),
            other_order_data
        }
    }

    pub fn update_order_data(&mut self, order_data: String) {
        self.other_order_data = order_data
    }

    pub fn order_id(&self) -> String {
        self.order_id.clone()
    }

    pub fn customer_id(&self) -> String {
        self.customer_id.clone()
    }
}

pub struct OrderRepository {
    client: Client,
    table_name: String
}

impl OrderRepository {
    pub async fn new(is_local: bool) -> Result<Self, ApplicationError> {
        let table_name = std::env::var("TABLE_NAME")?;

        let region_provider = RegionProviderChain::default_provider()
            .or_else("us-west-2");
        let sdk_config = aws_config::from_env().region(region_provider).load().await;
        if is_local {
            let config = aws_sdk_dynamodb::config::Builder::from(&sdk_config)
                .endpoint_url("http://localhost:8000".to_string())
                .region(Region::from_static("us-east-1"))
                .build();
            return Ok(Self{
                client: Client::from_conf(config),
                table_name
            });
        }

        let config = aws_sdk_dynamodb::config::Builder::from(&sdk_config).build();

        return Ok(Self{
            client: Client::from_conf(config),
            table_name
        });
    }

    async fn get_by_id(&self, customer_id: String, order_id: String) -> Result<Order, ApplicationError> {
        let get_res = &self.client
            .get_item()
            .key(DatabaseKeys::PK.to_string(), AttributeValue::S(customer_id))
            .key(DatabaseKeys::SK.to_string(), AttributeValue::S(order_id.clone()))
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|err|{
                let error_message = err.into_service_error().message().unwrap().to_string();
                ApplicationError::DatabaseError(error_message)
            })?;

        match &get_res.item {
            None => Err(ApplicationError::OrderNotFound(order_id.clone())),
            Some(item) => {
                Ok(Order{
                    order_id: item.get(&DatabaseKeys::SK.to_string()).unwrap().as_s().unwrap().clone(),
                    customer_id: item.get(&DatabaseKeys::PK.to_string()).unwrap().as_s().unwrap().clone(),
                    other_order_data: item.get(&DatabaseKeys::Data.to_string()).unwrap().as_s().unwrap().clone(),
                })
            }
        }
    }

    async fn add(&self, order: &Order) -> Result<(), ApplicationError> {
        let _ = &self.client
            .put_item()
            .item(DatabaseKeys::PK.to_string(), AttributeValue::S(order.customer_id()))
            .item(DatabaseKeys::SK.to_string(), AttributeValue::S(order.order_id()))
            .item(DatabaseKeys::Data.to_string(), AttributeValue::S(order.other_order_data.clone()))
            .item(
                DatabaseKeys::Type.to_string(),
                AttributeValue::S("Order".to_string()),
            )
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|err| ApplicationError::DatabaseError(err.into_service_error().to_string()));

        Ok(())
    }

    async fn update(&self, order: &Order) -> Result<(), ApplicationError> {
        let _ = &self.client
            .put_item()
            .item(DatabaseKeys::PK.to_string(), AttributeValue::S(order.customer_id()))
            .item(DatabaseKeys::SK.to_string(), AttributeValue::S(order.order_id()))
            .item(DatabaseKeys::Data.to_string(), AttributeValue::S(order.other_order_data.clone()))
            .item(
                DatabaseKeys::Type.to_string(),
                AttributeValue::S("Order".to_string()),
            )
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|err| ApplicationError::DatabaseError(err.into_service_error().to_string()));

        Ok(())
    }

    async fn delete(&self, order: &Order) -> Result<(), ApplicationError> {
        let _ = &self.client
            .delete_item()
            .key(DatabaseKeys::PK.to_string(), AttributeValue::S(order.customer_id()))
            .key(DatabaseKeys::SK.to_string(), AttributeValue::S(order.order_id()))
            .table_name(&self.table_name)
            .send()
            .await
            .map_err(|err| ApplicationError::DatabaseError(err.into_service_error().to_string()));

        Ok(())
    }
}