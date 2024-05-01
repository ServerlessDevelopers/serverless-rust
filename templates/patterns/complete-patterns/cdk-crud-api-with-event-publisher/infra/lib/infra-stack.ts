import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { RustFunction } from "cargo-lambda-cdk";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { AttributeType, BillingMode, StreamViewType, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  LambdaIntegration,
  Resource,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { GetByIdEndpoint } from "./constructs/get-by-id-endpoint";
import { DeleteByIdEndpoint } from "./constructs/delete-by-id-endpoint";
import { UpdateByIdEndpoint } from "./constructs/update-by-id-endpoint";
import { PostEndpoint } from "./constructs/post-endpoint";
import { EventPublisherFunction } from "./constructs/event-publisher-function";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, "ApiTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      stream: StreamViewType.NEW_AND_OLD_IMAGES
    });

    const api = new RestApi(this, "RestApi", {
      description: "Sample API",
      restApiName: "Sample API",
      disableExecuteApiEndpoint: false,
      deployOptions: {
        stageName: `main`,
      },
    });

    const customerIdResource = new Resource(this, "CustomerIdApiResource", {
      parent: api.root,
      pathPart: "{customerId}",
    });
    const orderIdResource = new Resource(this, "OrderIdApiResource", {
      parent: customerIdResource,
      pathPart: "{orderId}",
    });

    const postEndpoint = new PostEndpoint(this, "PostEndpoint", {
      table: table,
      apiResource: api.root
    });

    const getByIdEndpoint = new GetByIdEndpoint(this, "GetByIdEndpoint", {
      table: table,
      apiResource: orderIdResource
    });

    const deleteByIdEndpoint = new DeleteByIdEndpoint(this, "DeleteByIdEndpoint", {
      table: table,
      apiResource: orderIdResource
    });

    const updateByIdEndpoint = new UpdateByIdEndpoint(this, "UpdateByIdEndpoint", {
      table: table,
      apiResource: orderIdResource
    });

    const eventPublisherFunction = new EventPublisherFunction(this, "EventPublisherFunction", {
      table: table
    });

    const apiEndpoint = new cdk.CfnOutput(this, "ApiUrlOutput", {
      exportName: "ApiEndpoint",
      value: api.url
    });
  }
}
