import { document } from "../utils/dynamodbClient";

export const handle = async (event) => {
  const { userId } = event.pathParameters;

  const todos = await document.scan({ TableName: "user_todos" }).promise();

  const userTodos = todos.Items?.filter(({ user_id }) => user_id === userId);

  return {
    statusCode: 200,
    body: JSON.stringify(userTodos),
    headers: {
      ContentType: "application/json",
    },
  };
};
