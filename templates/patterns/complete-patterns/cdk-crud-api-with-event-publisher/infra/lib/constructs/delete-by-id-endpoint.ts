import { Construct } from "constructs";
import { RustFunction } from "cargo-lambda-cdk";
import { IResource, LambdaIntegration, Resource } from "aws-cdk-lib/aws-apigateway";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export class FunctionProps{
    apiResource: IResource
    table: Table
}

export class DeleteByIdEndpoint extends Construct {

    constructor(scope: Construct, id: string, props: FunctionProps) {
        super(scope, id);

        const deleteByIdFunction = new RustFunction(this, "DeleteByIdFunction", {
            manifestPath: "../lambdas/delete-by-id",
            memorySize: 128,
            architecture: Architecture.ARM_64,
            environment: {
              TABLE_NAME: props.table.tableName,
            },
          });

        props.apiResource
            .addMethod('DELETE', new LambdaIntegration(
                deleteByIdFunction, {
                proxy: true
            }));

        props.table.grantReadWriteData(deleteByIdFunction);
    }
}