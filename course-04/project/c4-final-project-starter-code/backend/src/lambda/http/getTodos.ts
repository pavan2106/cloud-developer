import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllToDo } from '../../helpers/todos'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = await getUserId(event);
    const res = await getAllToDo(userId)
    return { statusCode: 200, body: JSON.stringify(res) }
   
  })
handler.use(
  cors({
    credentials: true
  })
)
