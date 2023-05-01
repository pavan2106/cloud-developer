import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { VideoRequest } from '../../requests/VideoRequest'
import { updateVideo } from '../../helpers/videos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = await getUserId(event)
    const videoId = event.pathParameters.videoId
    const updatedVideo: VideoRequest = JSON.parse(event.body)
    const res = await updateVideo(updatedVideo, videoId, userId)
    return { body: JSON.stringify(res), statusCode: 200 }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
