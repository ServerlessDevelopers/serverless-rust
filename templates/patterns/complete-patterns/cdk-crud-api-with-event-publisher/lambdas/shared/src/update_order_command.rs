use serde::Deserialize;

use crate::{ApplicationError, OrderRepository};
use crate::view_models::OrderViewModel;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateOrderCommand {
    customer_id: String,
    order_id: String,
    order_data: String,
}

pub struct UpdateOrderCommandHandler {
    order_repository: OrderRepository
}

impl UpdateOrderCommandHandler {
    pub fn new(order_repository: OrderRepository) -> Self {
        Self {
            order_repository
        }
    }

    pub async fn handle(&self, command: UpdateOrderCommand) -> Result<OrderViewModel, ApplicationError>{
        let mut order = self.order_repository.get_by_id(command.customer_id, command.order_id).await?;

        order.update_order_data(command.order_data);

        self.order_repository.update(&order).await?;

        Ok(order.into())
    }
}