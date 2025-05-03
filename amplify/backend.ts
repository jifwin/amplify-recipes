import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { myDynamoDBFunction } from "./functions/dynamoDB-function/resource";
import { Stack } from "aws-cdk-lib";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";

const backend = defineBackend({
  auth,
  data,
  myDynamoDBFunction,
});

const table = backend.data.resources.tables["Recipes"];
const policy = new Policy(
    Stack.of(table),
    "MyDynamoDBFunctionStreamingPolicy",
    {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "dynamodb:DescribeStream",
            "dynamodb:GetRecords",
            "dynamodb:GetShardIterator",
            "dynamodb:ListStreams",
          ],
          resources: ["*"],
        }),
      ],
    }
);
backend.myDynamoDBFunction.resources.lambda.role?.attachInlinePolicy(policy);

const mapping = new EventSourceMapping(
    Stack.of(table),
    "MyDynamoDBFunctionTodoEventStreamMapping",
    {
      target: backend.myDynamoDBFunction.resources.lambda,
      eventSourceArn: table.tableStreamArn,
      startingPosition: StartingPosition.LATEST,
    }
);

mapping.node.addDependency(policy);
