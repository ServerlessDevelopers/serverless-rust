use serde::Deserialize;
use crate::{ApplicationError, OrderRepository};
use crate::view_models::OrderViewModel;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetOrderQuery {
    pub customer_id: String,
    pub order_id: String
}

pub struct GetOrderQueryHandler {
    order_repository: OrderRepository
}

impl GetOrderQueryHandler {
    pub fn new(order_repository: OrderRepository) -> Self {
        Self {
            order_repository
        }
    }

    pub async fn handle(&self, query: GetOrderQuery) -> Result<OrderViewModel, ApplicationError>{
        tracing::info!("Query for customer '{}' and order '{}'", query.customer_id, query.order_id);

        let order = self.order_repository.get_by_id(query.customer_id, query.order_id).await?;

        Ok(order.into())
    }
}