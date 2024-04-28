use std::collections::HashMap;
use std::time::Duration;
use lambda_runtime::{run, service_fn, tracing, Error, LambdaEvent};
use lambda_runtime::tracing::{info};
use aws_sdk_codedeploy::Client;
use aws_sdk_codedeploy::types::LifecycleEventStatus;
use reqwest::ClientBuilder;

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .json()
        .with_target(false)
        .without_time()
        .init();


    let alb_url = std::env::var("ALB_URL").expect("ALB_URL must be set");
    let alb_str = &alb_url.as_str();

    run(service_fn(
        move |event: LambdaEvent<HashMap<String, String>>| async move {
            function_handler(alb_str, event).await
        },
    )).await
}

async fn run_test(url: &str, path: String) -> Result<(), Error> {
    let request_url = format!("http://{url}/{path}", url = url, path = path);
    info!("{}", request_url);

    let timeout = Duration::new(2, 0);
    let client = ClientBuilder::new().timeout(timeout).build()?;
    let response = client.head(&request_url).send().await?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err(format!("Error: {}", response.status()).into())
    }
}

async fn function_handler(alb_url: &str, event: LambdaEvent<HashMap<String, String>>) -> Result<(), Error> {
    let deployment_id = event.payload.get("DeploymentId").unwrap();
    let lifecycle_event_hook_execution_id = event.payload.get("LifecycleEventHookExecutionId").unwrap();

    let config = aws_config::load_from_env().await;
    let client = Client::new(&config);

    let mut passed = true;

    // replaces the "one" to the route that needs to be exercised
    if let Err(_) = run_test(alb_url, "one".to_string()).await {
        info!("Test on Route one failed, rolling back");
        passed = false
    }

    let status = if passed {
        LifecycleEventStatus::Succeeded
    } else {
        LifecycleEventStatus::Failed
    };

    let cloned = status.clone();
    client.put_lifecycle_event_hook_execution_status()
        .deployment_id(deployment_id)
        .lifecycle_event_hook_execution_id(lifecycle_event_hook_execution_id)
        .status(status)
        .send().await?;

    info!("Wrapping up requests with a status of: {:?}", cloned);
    Ok(())
}
