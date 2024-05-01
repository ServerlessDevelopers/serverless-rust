use serde::Deserialize;

use crate::{ApplicationError, Order, OrderRepository};
use crate::view_models::OrderViewModel;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateOrderCommand {
    customer_id: String,
    order_data: String,
}

pub struct CreateOrderCommandHandler {
    order_repository: OrderRepository
}

impl CreateOrderCommandHandler {
    pub fn new(order_repository: OrderRepository) -> Self {
        Self {
            order_repository
        }
    }

    pub async fn handle(&self, command: CreateOrderCommand) -> Result<OrderViewModel, ApplicationError>{
        let order = Order::new(command.customer_id, command.order_data);

        self.order_repository.add(&order).await?;

        Ok(order.into())
    }
}