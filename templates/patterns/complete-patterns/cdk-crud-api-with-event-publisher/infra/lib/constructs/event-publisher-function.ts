import { Construct } from "constructs";
import { RustFunction } from "cargo-lambda-cdk";
import { Architecture, StartingPosition } from "aws-cdk-lib/aws-lambda";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { ITopic } from "aws-cdk-lib/aws-sns";

export class FunctionProps{
    table: ITable
    orderCreatedTopic: ITopic
    orderUpdatedTopic: ITopic
    orderDeletedTopic: ITopic
}

export class EventPublisherFunction extends Construct {

    constructor(scope: Construct, id: string, props: FunctionProps) {
        super(scope, id);

        const eventPublisherFunction = new RustFunction(this, "EventPublisherFunction", {
            manifestPath: "../lambdas/event-publisher",
            memorySize: 128,
            architecture: Architecture.ARM_64,
            environment: {
              TABLE_NAME: props.table.tableName,
              ORDER_CREATED_TOPIC: props.orderCreatedTopic.topicArn,
              ORDER_UPDATED_TOPIC: props.orderUpdatedTopic.topicArn,
              ORDER_DELETED_TOPIC: props.orderDeletedTopic.topicArn,
            },
          });

        props.table.grantStreamRead(eventPublisherFunction);
        props.orderCreatedTopic.grantPublish(eventPublisherFunction);
        props.orderUpdatedTopic.grantPublish(eventPublisherFunction);
        props.orderDeletedTopic.grantPublish(eventPublisherFunction);

        eventPublisherFunction.addEventSource(new DynamoEventSource(props.table, {
            startingPosition: StartingPosition.LATEST
        }));
    }
}