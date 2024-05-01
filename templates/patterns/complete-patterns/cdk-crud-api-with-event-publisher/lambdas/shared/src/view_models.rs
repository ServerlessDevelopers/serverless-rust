use serde::Serialize;
use crate::Order;

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct OrderViewModel {
    pub order_id: String,
    pub customer_id: String
}

impl From<Order> for OrderViewModel {
    fn from(value: Order) -> Self {
        Self {
            customer_id: value.customer_id,
            order_id: value.order_id
        }
    }
}