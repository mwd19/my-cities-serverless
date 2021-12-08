import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/places'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('Generate upload Url')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const placeId = event.pathParameters.placeId
    const userId = getUserId(event)
    if (!placeId) {
      logger.error('missing placeId')
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing placeId"
        })
      }
    }

    const attachementUrl = await createAttachmentPresignedUrl(placeId, userId)

    logger.info('Created url: ', { attachementUrl })

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: attachementUrl
      })

    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
