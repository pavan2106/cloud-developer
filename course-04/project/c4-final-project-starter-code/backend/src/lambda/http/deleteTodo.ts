import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = await getUserId(event);
    const todoId = event.pathParameters.todoId
  
    const res = await deleteTodo(todoId,userId)
    return { body: '' + res, statusCode: 200 }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
