import { success, failure } from "./libs/response-lib";

import AWS from "aws-sdk";

AWS.config.update({ region: "eu-west-1" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
  const id = event.pathParameters.mpId
  const params = {
    TableName: "CoronaMP_DEV",
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      mpId: id
    }
  };

  dynamoDb.get(params, (error, note) => {
    // Set response headers to enable CORS (Cross-Origin Resource Sharing)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };

    // Return status code 500 on error
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


    if (note) {
      dynamoDb.delete(params, function(err, data) {
      if (err) {
          console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      }
      });
    }

  });
}
