import { defineFunction } from "@aws-amplify/backend";
import { defineTable } from '@aws-amplify/backend';

export const myTable = defineTable({
    partitionKey: 'id',
    name: 'MyDynamoDBTable',
});

export const myDynamoDBFunction = defineFunction({
    name: "dynamoDB-function",
    resourceGroupName: "data",
    permissions: [myTable.permissions.write()],
});
