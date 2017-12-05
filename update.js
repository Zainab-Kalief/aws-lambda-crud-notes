import { success, failure } from "./libs/response-lib";
import AWS from "aws-sdk";

AWS.config.update({ region: "eu-west-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
  const id = event.pathParameters.id
  const data = JSON.parse(event.body)

  const params = {
    TableName: "CoronaMP_DEV",
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      mpId: id
    }
  };
  const params2 = {
    TableName: "CoronaMP_DEV",
    Item: {
      mpId: id,
      name: data.name,
      address: data.address
    }

  };

  dynamoDb.get(params, (error, data) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };
    if (error) {
      console.log(error);
      const response = {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ status: false })
      };
      callback(null, response);
      return;
    }

    if (data) {

      dynamoDb.put(params2, (error, data) => {
        const headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        };
        if (error) {
          console.log(error, '~~~~~~~~2');
          const response = {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ status: false })
          };
          callback(null, response);
          return;
        }

        // Return status code 200 and the newly created item
        const response = {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(data.Item)
        };
        callback(null, response);
      });

    }

  });
}
