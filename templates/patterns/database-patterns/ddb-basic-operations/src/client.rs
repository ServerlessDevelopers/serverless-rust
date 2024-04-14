use aws_config::meta::region::RegionProviderChain;
use aws_config::Region;
use aws_sdk_dynamodb::Client;

pub async fn new_client(is_local: String) -> Client {
    let region_provider = RegionProviderChain::default_provider()
        .or_else("us-west-2");
    let sdk_config = aws_config::from_env().region(region_provider).load().await;
    if is_local.to_ascii_lowercase() == "true".to_string() {
        let config = aws_sdk_dynamodb::config::Builder::from(&sdk_config)
            .endpoint_url("http://localhost:8000".to_string())
            .region(Region::from_static("us-east-1"))
            .build();
        return Client::from_conf(config);
    }

    let config = aws_sdk_dynamodb::config::Builder::from(&sdk_config).build();
    Client::from_conf(config)
}
