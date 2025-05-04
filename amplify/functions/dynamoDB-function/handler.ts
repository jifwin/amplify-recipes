import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const logger = new Logger({
    logLevel: "INFO",
    serviceName: "dynamodb-stream-handler",
});
const dynamoDBClient = new DynamoDBClient({});

export const handler: DynamoDBStreamHandler = async (event) => {
    for (const record of event.Records) {
        logger.info(`Processing record: ${record.eventID}`);
        logger.info(`Event Type: ${record.eventName}`);

        if (record.eventName === "INSERT") {
            // business logic to process new records
            // logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);

            const command = new PutItemCommand({
                TableName: "Processed",
                Item: {
                    id: { S: crypto.randomUUID() },
                    content: { S: "test"}
                },
            });

            try {
                await dynamoDBClient.send(command);
                console.log({ statusCode: 200, body: 'Item written successfully' });
            } catch (err) {
                console.error(err);
            }
        }
    }
    logger.info(`Successfully processed ${event.Records.length} records.`);

    return {
        batchItemFailures: [],
    };
};
