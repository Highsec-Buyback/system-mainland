
import { APIGatewayEvent } from 'aws-lambda';
import { isMainland as isMainlandLoader } from '../lib/red-frog';
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocument.from(new DynamoDBClient({}));

const {TABLE} = process.env;

if (!TABLE) {
    throw Error(`Missing env var TABLE`);
}

async function getFromDB(key: string) {
  const params = {
    TableName: TABLE,
    Key: { 
        pk:  `systems`,
        sk: `${key}`,
    }
  };
  const data = await ddb.send(new GetCommand(params));
  return data.Item;
}

async function putToDB(key: string, isMainland: boolean) {
  const params = {
    TableName: TABLE,
    Item: { 
        pk:  `systems`,
        sk: `${key}`,
        isMainland,
        created: new Date().toISOString(),
    }
  };
  await ddb.send(new PutCommand(params));
}

function isRandomSmaller(input: number): boolean {
  const randomNumber = Math.floor(Math.random() * 101);
  return randomNumber < input;
}

async function getOrBuildRecord(key: string, f: (key: string) => Promise<boolean>): Promise<boolean> {
  let record = await getFromDB(key);

  if (!record || isRandomSmaller(Math.floor((Date.now() - new Date(record.date).getTime()) / (1000 * 60 * 60 * 24)))) {
    const isMainland = await f(key);
    await putToDB(key, isMainland);
    return isMainland;
  } else {
    return record.isMainland;
  }
}

export async function handler(event: APIGatewayEvent) {

  const systemName = event.queryStringParameters?.systemName;
  if (!systemName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Parameters are missing' }),
    };
  }

  const isMainland = await getOrBuildRecord(systemName.toLowerCase(), isMainlandLoader);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
        isMainland,
    }),
  };

  return response;
}



