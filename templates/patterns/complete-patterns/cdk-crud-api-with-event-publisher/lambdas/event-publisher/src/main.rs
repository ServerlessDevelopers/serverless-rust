use aws_config::meta::region::RegionProviderChain;
use tracing_subscriber::filter::{EnvFilter, LevelFilter};
use aws_lambda_events::event::dynamodb::Event;
use aws_sdk_sns::Client;
use aws_sdk_sns::config::Region;
use lambda_runtime::{run, service_fn, Error, LambdaEvent};
use serde_dynamo::{AttributeValue, Item};
use tracing::info;
use shared::DatabaseKeys;

enum DynamoDbEventname {
    INSERT,
    MODIFY,
    REMOVE
}

async fn function_handler(sns_client: &Client, event: LambdaEvent<Event>) -> Result<(), Error> {
    info!("(BatchSize)={:?}", event.payload.records.len());
    for record in event.payload.records {
        let stream_data = match record.event_name.as_str() {
            "INSERT" => {
                let stream_data: StreamData = record.change.new_image.into();
                tracing::info!("Inserted: {}", stream_data.order_id);

                stream_data
            },
            "MODIFY" => {
                let stream_data: StreamData = record.change.new_image.into();
                tracing::info!("Modified: {}", stream_data.order_id);

                stream_data
            },
            "REMOVE" => {
                let stream_data: StreamData = record.change.old_image.into();
                tracing::info!("Deleted: {}", stream_data.order_id);

                stream_data
            },
            _ => {
                tracing::info!("Unknown stream type");
                continue;
            }
        };


    }

    Ok(())
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