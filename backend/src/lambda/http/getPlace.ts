import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { getPlace } from '../../businessLogic/places'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const placeId = event.pathParameters.placeId
    if (!placeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing placeId' })
      }
    }

    const userId = getUserId(event)
    const place = await getPlace(placeId, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
          place
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
