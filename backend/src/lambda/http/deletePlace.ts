import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deletePlace } from '../../businessLogic/places'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const placeId = event.pathParameters.placeId
    if (!placeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'PlaceId missing'
        })
      }
    }

    const userId = getUserId(event)
    await deletePlace(placeId, userId)

    return {
      statusCode: 204,
      body: JSON.stringify({})
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
