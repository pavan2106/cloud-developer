import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { generateVideoUploadUrl } from '../../helpers/videos';
const logger = createLogger('generateUploadUrl');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const videoId = event.pathParameters.videoId
      const userId = await getUserId(event);
      const res = await generateVideoUploadUrl(videoId, userId);
      logger.log('upload url', res)
      return { body: JSON.stringify({ uploadUrl: res }), statusCode: 200 }
    } catch (err) {
      logger.error('Generate URL' + JSON.stringify(err))
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
