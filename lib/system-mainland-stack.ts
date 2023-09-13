import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';

export class SystemMainlandStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    cdk.Tags.of(this).add('project', 'system-mainland');

    const table = new dynamodb.Table(this, 'SystemMainlandTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const nodeFunction = new nodejs.NodejsFunction(this, 'Handler', {
      entry: './src/functions/systems-mainland.ts',
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      environment: {
        TABLE: table.tableName,
      },
    });

    table.grantReadWriteData(nodeFunction);

    const api = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: nodeFunction,
      proxy: false,
    });

    const mainlandResource = api.root.addResource('mainland');
    mainlandResource.addMethod('GET');

    new cdk.CfnOutput(this, 'Url', {
      value: api.url,
    });
    
  }
}
