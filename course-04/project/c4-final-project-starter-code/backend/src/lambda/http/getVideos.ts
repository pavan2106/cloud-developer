import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils';
import { getAllVideo } from '../../helpers/videos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = await getUserId(event);
    const res = await getAllVideo(userId);
    return { statusCode: 200, body: JSON.stringify(res) }
  })
handler.use(
  cors({
    credentials: true
  })
)
