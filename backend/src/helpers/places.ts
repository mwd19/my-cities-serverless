import { PlacesAccess } from './placesAccess'
import { AttachmentUtils } from './attachmentUtils';
import { PlaceItem } from '../models/PlaceItem'
import { CreatePlaceRequest } from '../requests/CreatePlaceRequest'
import { UpdatePlaceRequest } from '../requests/UpdatePlaceRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// Instantiate data layer objects
const placesAccess = new PlacesAccess()
const attachmentUtils = new AttachmentUtils()

const logger = createLogger('Places')

export async function getPlacesForUser(userId) {
    logger.info('Getting all places for the user: ', userId)
    return await placesAccess.getPlaces(userId)
}

export async function createPlace(createPlaceRequest: CreatePlaceRequest, userId: string): Promise<PlaceItem> {

    const placeId = uuid.v4()
    const name = createPlaceRequest.name
    const latitude = createPlaceRequest.latitude
    const longitude = createPlaceRequest.longitude
    const city = createPlaceRequest.city
    const country = createPlaceRequest.country
    const createdAt = new Date().toString()

    const placeItem: PlaceItem = {
        userId,
        placeId,
        createdAt,
        name,
        latitude,
        longitude,
        city,
        country
    }

    logger.info('Creating place: ', placeId)
    return await placesAccess.createPlace(placeItem)
}

export async function updatePlace(updatePlaceRequest: UpdatePlaceRequest, placeId: string, userId: string,) {
    logger.info('Updating place: ', placeId)
    return await placesAccess.updatePlace(placeId, userId, updatePlaceRequest)
}

export async function deletePlace(placeId: string, userId: string) {
    logger.info('Deleting place: ', placeId)
    return await placesAccess.deletePlace(placeId, userId)
}

export async function createAttachmentPresignedUrl(placeId: string, userId) {
    logger.info('Creating image url for place: ', {placeId: placeId})
    const attachement_url = attachmentUtils.createAttachmentPresignedUrl(placeId)
    return await placesAccess.updateAttachmentUrl(attachement_url, placeId, userId)
}
