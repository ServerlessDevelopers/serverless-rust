use serde::{Deserialize, Serialize};
use serde_dynamo::{AttributeValue, Item};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SampleModel {
    id: i32,
    message: String,
    entity_type: String
}

impl From<Item> for SampleModel {
    fn from(value: Item) -> Self {

        let id_attr = value.get("Id");
        let message_attr: Option<&AttributeValue> = value.get("Message");
        let entity_type_attr: Option<&AttributeValue> = value.get("EntityType");
        let mut id = 0;
        let mut message = String::new();
        let mut entity_type = String::new();

        if let Some(AttributeValue::N(n)) = id_attr {
            if let Ok(i) = n.parse::<i32>() {
                id = i;
            }
        }

        if let Some(AttributeValue::S(s)) = entity_type_attr {
            entity_type = s.clone();
        }

        if let Some(AttributeValue::S(s)) = message_attr {
            message = s.clone();
        }

        SampleModel {
            id,
            message,
            entity_type
        }
    }
}