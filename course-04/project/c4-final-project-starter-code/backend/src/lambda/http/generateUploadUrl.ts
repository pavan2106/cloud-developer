import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { generateUploadUrl } from '../../helpers/todos'
import { getUserId } from '../utils';
const logger = createLogger('generateUploadUrl')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.todoId
      const userId = await getUserId(event);
      const res = await generateUploadUrl(todoId, userId);
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
