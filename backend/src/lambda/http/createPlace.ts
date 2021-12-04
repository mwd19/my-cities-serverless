import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreatePlaceRequest } from '../../requests/CreatePlaceRequest'
import { getUserId } from '../utils';
import { createPlace } from '../../helpers/places'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newPlace: CreatePlaceRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const placeItem = await createPlace(newPlace, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: placeItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
