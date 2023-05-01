import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { VideoRequest } from '../../requests/VideoRequest'
import { createVideo } from '../../helpers/videos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newVideo: VideoRequest = JSON.parse(event.body)
    const userId = await getUserId(event);
    const res = await createVideo(newVideo, userId)
    return { statusCode: 201, body: JSON.stringify(res) }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
