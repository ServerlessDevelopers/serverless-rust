use chrono::Utc;
use tracing::info;
use crate::client::new_client;
use crate::models::BasicEntity;
use crate::data::{create_item, delete_item, get_item, get_items, update_item};
use svix_ksuid::{Ksuid, KsuidLike};

mod client;
mod models;
mod data;
mod errors;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    let is_local = std::env::var("IS_LOCAL").unwrap_or("false".to_string());
    let client = new_client(is_local).await;
    let table_name = &std::env::var("TABLE_NAME").expect("TABLE_NAME must be set");
    let shared_client = &client;

    let mut i = 0;
    let mut all_items: Vec<BasicEntity> = Vec::new();

    while i < 100 {
        let ksuid = Ksuid::new(None, None);
        let dt = Utc::now();
        let timestamp: i64 = dt.timestamp();

        let basic_entity = BasicEntity::new(ksuid.to_string(), format!("Name: {:?}", i),format!("Description: {:?}", i), "BasicEntity".to_string(), timestamp, timestamp);
        all_items.push(basic_entity.clone());
        let item = create_item(shared_client, table_name, basic_entity).await;
        
        match item {
            Ok(be) => {
                let lookup = get_item(shared_client, table_name, be.get_id().as_str()).await;
                match lookup {
                    Ok(i) => info!("Item: {:?}", i),
                    Err(e) => info!("Error getting item: {:?}", e)
                }

                let rem = i % 10;
                if rem == 0 {
                    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
                    let dt = Utc::now();
                    let timestamp: i64 = dt.timestamp();

                    let m = update_item(shared_client, table_name, be.get_id().as_str(), timestamp).await;
                    match m {
                        Ok(_) => info!("Updated timestamp on item: {:?}", i),
                        Err(e) => info!("Error updating item: {:?}", e)
                    }
                }

            },
            Err(e) => info!("Error creating item: {:?}", e)
        }
        i += 1;
    }

    let items = get_items(shared_client, table_name, 50).await;
    match items {
        Ok(i) => {
            for item in i {
                info!("Scanned Item: {:?}", item);
            }
        },
        Err(e) => info!("Error getting items: {:?}", e)
    }

    for item in all_items {
        let deleted = delete_item(shared_client, table_name, item.get_id().as_str()).await;
        match deleted {
            Ok(_) => info!("Deleted item: {:?}", item),
            Err(e) => info!("Error deleting item: {:?}", e)
        }
    }
}


