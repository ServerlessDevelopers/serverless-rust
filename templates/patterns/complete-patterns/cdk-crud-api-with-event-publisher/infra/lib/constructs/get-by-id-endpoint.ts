import { Construct } from "constructs";
import { RustFunction } from "cargo-lambda-cdk";
import { IResource, LambdaIntegration, Resource } from "aws-cdk-lib/aws-apigateway";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export class FunctionProps{
    apiResource: IResource
    table: Table
}

export class GetByIdEndpoint extends Construct {

    constructor(scope: Construct, id: string, props: FunctionProps) {
        super(scope, id);

        const getByIdFunction = new RustFunction(this, "GetAllFunction", {
            functionName: "get-by-id",
            manifestPath: "../lambdas/get-by-id",
            memorySize: 128,
            architecture: Architecture.ARM_64,
            environment: {
              TABLE_NAME: props.table.tableName,
            },
          });

        props.apiResource
            .addMethod('GET', new LambdaIntegration(
                getByIdFunction, {
                proxy: true
            }));

        props.table.grantReadData(getByIdFunction);
    }
}