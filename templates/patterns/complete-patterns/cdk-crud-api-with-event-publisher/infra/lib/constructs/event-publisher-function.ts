import { Construct } from "constructs";
import { RustFunction } from "cargo-lambda-cdk";
import { Architecture, StartingPosition } from "aws-cdk-lib/aws-lambda";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class FunctionProps{
    table: ITable
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
            },
          });

        props.table.grantStreamRead(eventPublisherFunction);

        eventPublisherFunction.addEventSource(new DynamoEventSource(props.table, {
            startingPosition: StartingPosition.LATEST
        }));
    }
}