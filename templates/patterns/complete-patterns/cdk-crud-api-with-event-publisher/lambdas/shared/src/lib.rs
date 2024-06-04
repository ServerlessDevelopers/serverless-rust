mod view_models;
mod create_order_command;
mod update_order_command;
mod get_order_query;
mod delete_order_command;
mod order;

pub use view_models::OrderViewModel;
pub use create_order_command::{CreateOrderCommand, CreateOrderCommandHandler};
pub use update_order_command::{UpdateOrderCommand, UpdateOrderCommandHandler};
pub use get_order_query::{GetOrderQuery, GetOrderQueryHandler};
pub use delete_order_command::{DeleteOrderCommand, DeleteOrderCommandHandler};
pub use order::{Order, OrderRepository};

use std::env::VarError;
use std::fmt;
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