import { Construct } from "constructs";
import { RustFunction } from "cargo-lambda-cdk";
import { IResource, LambdaIntegration, Resource } from "aws-cdk-lib/aws-apigateway";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export class FunctionProps{
    apiResource: IResource
    table: Table
}

export class PostEndpoint extends Construct {

    constructor(scope: Construct, id: string, props: FunctionProps) {
        super(scope, id);

        const postFunction = new RustFunction(this, "PostFunction", {
            manifestPath: "../lambdas/post",
            memorySize: 128,
            architecture: Architecture.ARM_64,
            environment: {
              TABLE_NAME: props.table.tableName,
            },
          });

        props.apiResource
            .addMethod('POST', new LambdaIntegration(
                postFunction, {
                proxy: true
            }));

        props.table.grantReadWriteData(postFunction);
    }
}