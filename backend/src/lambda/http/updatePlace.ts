import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updatePlace } from '../../helpers/places'
import { UpdatePlaceRequest } from '../../requests/UpdatePlaceRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const placeId = event.pathParameters.placeId
    const updatedPlace: UpdatePlaceRequest = JSON.parse(event.body)
    if (!placeId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing placeId' })
      }
    }

    const userId = getUserId(event)
    await updatePlace(updatedPlace, placeId, userId)

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
