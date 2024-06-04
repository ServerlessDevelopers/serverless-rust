use std::env::var;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use aws_sdk_kinesis::Client;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use aws_config::meta::region::RegionProviderChain;
use aws_config::Region;
use aws_sdk_kinesis::operation::put_record::{PutRecordError, PutRecordOutput};
use aws_sdk_kinesis::primitives::Blob;
use clap::{arg, command, value_parser, ArgAction, Command};
use rand::Rng;
use serde::{Deserialize, Serialize};
use tokio::time::{sleep};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .with_target(false)
        .without_time()
        .init();

    let matches = command!() // requires `cargo` feature
        .arg(arg!([kinesis_stream] "Kinesis stream to operate on")
            .required(true))
        .get_matches();

    let stream_arn = matches.get_one::<String>("kinesis_stream").unwrap();

    let kinesis_client = new_client("false".to_string()).await;

    let device_1 = IoTDevice::new("device1".to_string());
    let device_2 = IoTDevice::new("device2".to_string());
    let device_3 = IoTDevice::new("device3".to_string());
    let device_4 = IoTDevice::new("device4".to_string());
    let device_5 = IoTDevice::new("device5".to_string());
    let device_6 = IoTDevice::new("device6".to_string());
    let device_7 = IoTDevice::new("device7".to_string());
    let device_8 = IoTDevice::new("device8".to_string());
    let device_9 = IoTDevice::new("device9".to_string());
    let device_10 = IoTDevice::new("device10".to_string());

    loop {
        device_1.send_temperature_data(&kinesis_client, stream_arn).await;
        device_2.send_temperature_data(&kinesis_client, stream_arn).await;
        device_3.send_temperature_data(&kinesis_client, stream_arn).await;
        device_4.send_temperature_data(&kinesis_client, stream_arn).await;
        device_5.send_temperature_data(&kinesis_client, stream_arn).await;
        device_6.send_temperature_data(&kinesis_client, stream_arn).await;
        device_7.send_temperature_data(&kinesis_client, stream_arn).await;
        device_8.send_temperature_data(&kinesis_client, stream_arn).await;
        device_9.send_temperature_data(&kinesis_client, stream_arn).await;
        device_10.send_temperature_data(&kinesis_client, stream_arn).await;

        sleep(Duration::from_secs(1)).await;
    }
}

struct IoTDevice {
    name: String
}

impl IoTDevice {
    fn new(name: String) -> Self {
        IoTDevice { name }
    }

    pub async fn send_temperature_data(&self, client: &Client, kinesis_stream_arn: &String) -> () {
        let mut rng = rand::thread_rng();

        let temperature_reading = TemperatureReading::new(rng.gen_range(10.0..25.6));

        let serialized_data = serde_json::to_string(&temperature_reading).unwrap();

        let put_res = client.put_record()
            .stream_arn(kinesis_stream_arn)
            .partition_key(&self.name)
            .data(Blob::new(serialized_data))
            .send()
            .await;

        match put_res {
            Ok(_) => tracing::info!("Success sending Kinesis data for device {}", &self.name),
            Err(e) => {
                tracing::error!("Failure sending kinesis data for device {}", &self.name);
                tracing::error!("{}", e.into_service_error().to_string());
            }
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct TemperatureReading {
    temperature: f32,
    reading_timestamp: f32
}

impl TemperatureReading {
    fn new(temperature: f32) -> Self {
        Self {
            temperature,
            reading_timestamp: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs_f32()
        }
    }
}

async fn new_client(is_local: String) -> Client {
    let region_provider = RegionProviderChain::default_provider()
        .or_else("us-west-2");
    let sdk_config = aws_config::from_env().region(region_provider).load().await;
    if is_local.to_ascii_lowercase() == "true".to_string() {
        let config = aws_sdk_kinesis::config::Builder::from(&sdk_config)
            .endpoint_url("http://localhost:8000".to_string())
            .region(Region::from_static("eu-west-1"))
            .build();
        return Client::from_conf(config);
    }

    let config = aws_sdk_kinesis::config::Builder::from(&sdk_config).build();
    Client::from_conf(config)
}