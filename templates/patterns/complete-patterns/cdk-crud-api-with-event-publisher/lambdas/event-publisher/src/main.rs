use aws_config::meta::region::RegionProviderChain;
use tracing_subscriber::filter::{EnvFilter, LevelFilter};
use aws_lambda_events::event::dynamodb::Event;
use aws_sdk_sns::Client;
use aws_sdk_sns::config::Region;
use cloudevents::v02::{CloudEvent, CloudEventBuilder, Data};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde::Serialize;
use serde_dynamo::{AttributeValue, Item};
use tracing::info;
use shared::DatabaseKeys;
use uuid::Uuid;

async fn function_handler(sns_client: &Client, event: LambdaEvent<Event>) -> Result<(), Error> {
    info!("(BatchSize)={:?}", event.payload.records.len());

    for record in event.payload.records {
        let (stream_data, evt, topic_arn): (StreamData, CloudEvent, String) = match record.event_name.as_str() {
            "INSERT" => {
                OrderCreatedEvent::parse(record.change.new_image)
            },
            "MODIFY" => {
                OrderUpdatedEvent::parse(record.change.new_image)
            },
            "REMOVE" => {
                OrderDeletedEvent::parse(record.change.old_image)
            },
            _ => {
                info!("Unknown stream type");
                continue;
            }
        };

        if stream_data.data_type != "Order" {
            continue;
        }

        let evt_data = serde_json::to_string(&evt).unwrap();

        info!("{}", &evt_data);

        let _ = sns_client.publish()
            .topic_arn(topic_arn)
            .message(evt_data)
            .send()
            .await?;
    }

    Ok(())
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct OrderCreatedEvent {
    order_id: String,
    customer_id: String
}

impl OrderCreatedEvent {
    fn parse(record: Item) -> (StreamData, CloudEvent, String) {
        let stream_data: StreamData = record.into();
        let event = CloudEventBuilder::default()
            .event_id(Uuid::new_v4().to_string())
            .event_type("order.created.v1")
            .source("https://orders.api")
            .contenttype("application/json")
            .data(Data::from_serializable(OrderCreatedEvent {
                customer_id: stream_data.customer_id.clone(),
                order_id: stream_data.order_id.clone(),
            }).unwrap())
            .build();

        (stream_data, event.unwrap(), std::env::var("ORDER_CREATED_TOPIC").unwrap())
    }
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct OrderUpdatedEvent {
    order_id: String,
    customer_id: String
}

impl OrderUpdatedEvent {
    fn parse(record: Item) -> (StreamData, CloudEvent, String) {
        let stream_data: StreamData = record.into();
        let event = CloudEventBuilder::default()
            .event_id(Uuid::new_v4().to_string())
            .event_type("order.updated.v1")
            .source("https://orders.api")
            .contenttype("application/json")
            .data(Data::from_serializable(OrderUpdatedEvent {
                customer_id: stream_data.customer_id.clone(),
                order_id: stream_data.order_id.clone(),
            }).unwrap())
            .build();

        (stream_data, event.unwrap(), std::env::var("ORDER_UPDATED_TOPIC").unwrap())
    }
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct OrderDeletedEvent {
    order_id: String,
    customer_id: String
}

impl OrderDeletedEvent {
    fn parse(record: Item) -> (StreamData, CloudEvent, String) {
        let stream_data: StreamData = record.into();
        let event = CloudEventBuilder::default()
            .event_id(Uuid::new_v4().to_string())
            .event_type("order.deleted.v1")
            .source("https://orders.api")
            .contenttype("application/json")
            .data(Data::from_serializable(OrderDeletedEvent {
                customer_id: stream_data.customer_id.clone(),
                order_id: stream_data.order_id.clone(),
            }).unwrap())
            .build();

        (stream_data, event.unwrap(), std::env::var("ORDER_DELETED_TOPIC").unwrap())
    }
}

struct StreamData {
    order_id: String,
    customer_id: String,
    order_data: String,
    data_type: String
}

impl From<Item> for StreamData {
    fn from(value: Item) -> Self {
        let customer_id_attr = value.get(&DatabaseKeys::PK.to_string());
        let order_id_attr: Option<&AttributeValue> = value.get(&DatabaseKeys::SK.to_string());
        let order_data_attr: Option<&AttributeValue> = value.get(&DatabaseKeys::Data.to_string());
        let type_attr: Option<&AttributeValue> = value.get(&DatabaseKeys::Type.to_string());
        let mut customer_id = String::new();
        let mut order_id = String::new();
        let mut order_data = String::new();
        let mut data_type = String::new();

        if let Some(AttributeValue::S(s)) = customer_id_attr {
            customer_id = s.clone();
        }

        if let Some(AttributeValue::S(s)) = order_id_attr {
            order_id = s.clone();
        }

        if let Some(AttributeValue::S(s)) = order_data_attr {
            order_data = s.clone();
        }

        if let Some(AttributeValue::S(s)) = type_attr {
            data_type = s.clone();
        }

        StreamData {
            customer_id,
            order_id,
            order_data,
            data_type
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive(LevelFilter::INFO.into())
                .from_env_lossy(),
        )
        .json()
        .with_target(false)
        .without_time()
        .init();

    let region_provider = RegionProviderChain::default_provider()
        .or_else("us-west-2");
    let sdk_config = aws_config::from_env().region(region_provider).load().await;

    let config = aws_sdk_sns::config::Builder::from(&sdk_config).build();
    let sns_client = Client::from_conf(config);

    run(service_fn(|evt|{
        function_handler(&sns_client, evt)
    })).await
}