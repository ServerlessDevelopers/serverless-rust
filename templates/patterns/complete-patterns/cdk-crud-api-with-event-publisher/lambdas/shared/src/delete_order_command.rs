use serde::Deserialize;

use crate::{ApplicationError, OrderRepository};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteOrderCommand {
    pub customer_id: String,
    pub order_id: String,
}

pub struct DeleteOrderCommandHandler {
    order_repository: OrderRepository
}

impl DeleteOrderCommandHandler {
    pub fn new(order_repository: OrderRepository) -> Self {
        Self {
            order_repository
        }
    }

    pub async fn handle(&self, command: DeleteOrderCommand) -> Result<(), ApplicationError>{
        let order = &self.order_repository.get_by_id(command.customer_id, command.order_id).await?;

        let _ = &self.order_repository.delete(order).await?;

        Ok(())
    }
}