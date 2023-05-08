import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { VideoItem } from '../models/VideoItem';
import { VideoUpdate } from '../models/VideoUpdate';
const logger = createLogger('VideoAcess')
const videoTable = process.env.VIDEO_TABLE
const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient()

const createVideoItem = async (item: VideoItem): Promise<{ item: VideoItem }> => {
  logger.log(
    'Creating new Video by ' + item.userId,
    JSON.stringify(item)
  )

  const params = {
    TableName: videoTable,
    Item: item
  }

  const result = await docClient.put(params).promise()
  logger.log('result', JSON.stringify(result))

  return { item }
}

const updateVideoItem = async (
  item: VideoUpdate,
  videoId: string,
  userId: string
): Promise<VideoUpdate> => {
  logger.log('Updating Video', videoId)

  const params = {
    TableName: videoTable,
    Key: {
      userId: userId,
      videoId: videoId
    },
    UpdateExpression: 'set #title = :title, #updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#title': 'title',
      '#updatedAt': 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':title': item['name'],
      ':updatedAt': item.updatedAt
    },
    ReturnValues: 'ALL_NEW'
  }

  const result = await docClient.update(params).promise()
  logger.log('result', JSON.stringify(result))
  const attributes: VideoUpdate = (result.Attributes as VideoUpdate)

  return attributes;
}

const deleteVideoItem = async (videoId: string, userId: string): Promise<string> => {
  logger.log('Deleting Video item ', videoId)

  const params = {
    TableName: videoTable,
    Key: {
      userId: userId,
      videoId: videoId
    }
  }

  const result = await docClient.delete(params).promise()
  logger.log('result', JSON.stringify(result))

  return '' as string
}

const getAllVideoItems = async (userId: string): Promise<{ items: VideoItem[] }> => {
    logger.log('Getting all video for user', userId)
  
    const params = {
      TableName: videoTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }
  
    const result = await docClient.query(params).promise()
    logger.log('items', JSON.stringify(result))
    const items: VideoItem[] = (result.Items as VideoItem[]);
  
    return { items };
  }
  
const generateVideoItemUploadUrl = async (
  videoId: string,
  userId: string
): Promise<string> => {
  logger.log('Generating URL for', videoId)
  try {
    const s3Client = new AWS.S3({ signatureVersion: 'v4' })
    const s3BucketName = process.env.VIDEO_S3_BUCKET_NAME

    const url = s3Client.getSignedUrl('putObject', {
      Bucket: s3BucketName,
      Key: videoId,
      Expires: 100
    })
    logger.log('url', url)
    await updateVideoObj(videoId, userId, url)
    return url;
  } catch (err) {
    logger.error(JSON.stringify(err))
  }
}

const updateVideoObj = async (
  videoId: string,
  userId: string,
  url: string
): Promise<string> => {
  logger.log('Updating Video by ' + userId, videoId)

  const params = {
    TableName: videoTable,
    Key: {
      userId: userId,
      videoId: videoId
    },
    UpdateExpression: 'set #url = :url',
    ExpressionAttributeNames: {
      '#url': 'url'
    },
    ExpressionAttributeValues: {
      ':url': url.split('?')[0]
    },
    ReturnValues: 'ALL_NEW'
  }

  const result = await docClient.update(params).promise()
  logger.log('result', JSON.stringify(result))
  return url
}

export {
  createVideoItem,
  updateVideoItem,
  deleteVideoItem,
  getAllVideoItems,
  generateVideoItemUploadUrl
}
