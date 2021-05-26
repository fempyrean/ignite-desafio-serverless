import { v4 as uuidV4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface CreateTodoDTO {
  title: string;
  deadline: string;
}

export const handle = async (event) => {
  const { userId } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as CreateTodoDTO;

  const id = uuidV4();
  const deadlineDate = new Date(deadline).toString();

  await document
    .put({
      TableName: "user_todos",
      Item: {
        id,
        user_id: userId,
        title,
        done: false,
        deadline: deadlineDate,
      },
    })
    .promise();

  const todo = await document
    .query({
      TableName: "user_todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(todo.Items[0]),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
