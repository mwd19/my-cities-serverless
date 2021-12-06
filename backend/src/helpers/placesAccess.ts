import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { PlaceItem } from '../models/PlaceItem'
import { PlaceUpdate } from '../models/PlaceUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('PlacesAccess')

export class PlacesAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
		private readonly placesTable = process.env.PLACES_TABLE
    ) { }


    async getPlaces(userId: string): Promise<PlaceItem[]> {
        const result = await this.docClient.query({
            TableName: this.placesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        logger.info('Returned all places: ', result.Items as PlaceItem[])

        return result.Items as PlaceItem[]
    }

    async createPlace(placeItem: PlaceItem): Promise<PlaceItem> {
        await this.docClient.put({
            TableName: this.placesTable,
            Item: placeItem
        }).promise()

        logger.info(`New place item created: ${ placeItem }`)

        return placeItem
    }

    async getPlace(placeId: string, userId: string): Promise<PlaceItem> {
        const result = await this.docClient.query({
            TableName: this.placesTable,
            KeyConditionExpression: 'userId = :userId AND placeId = :placeId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':placeId': placeId
            }
        }).promise()

        logger.info('Return a place: ', result.Items[0] as PlaceItem)

        return result.Items[0] as PlaceItem
    }

    async updatePlace(placeId: string, userId: string, placeUpdate: PlaceUpdate) {
        await this.docClient.update({
            TableName: this.placesTable,
            Key: {
                userId: userId,
                placeId: placeId
            },
            UpdateExpression: "set #name = :name, #city=:city, #country=:country",
            ExpressionAttributeValues: {
                ":name": placeUpdate.name,
                ":latitude": placeUpdate.latitude,
                ":longitude": placeUpdate.longitude,
                ":city": placeUpdate.city,
                ":country": placeUpdate.country,
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#city': 'city',
                '#country': 'country'
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
        logger.info(`Place item id: ${ placeId } was updated`)
        return placeUpdate
    }

    async deletePlace(placeId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.placesTable,
            Key: {
                placeId,
                userId
            },
            ReturnValues: 'ALL_OLD'
        }).promise()

        logger.info(`Place item id: ${ placeId } was deleted`)
    }

    async updateAttachmentUrl(attachmentUrl: string, placeId: string, userId: string) {
        logger.info('Adding attachement url')
        await this.docClient.update({
            TableName: this.placesTable,
            Key: { placeId, userId },
            UpdateExpression:
                'set #attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            },
            ExpressionAttributeNames: {
                '#attachmentUrl': 'attachmentUrl'
            },
            ReturnValues: "ALL_NEW"
        }).promise()
        logger.info("Added attachment Url for: ", { placeId })
        return attachmentUrl
    }
}

function createDynamoDBClient(): AWS.DynamoDB.DocumentClient {
	if (process.env.IS_OFFLINE) {
		logger.info('Creating a local DynamoDB instance')
		return new XAWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: 'http://localhost:8000'
		})
	}

	return new XAWS.DynamoDB.DocumentClient()
}