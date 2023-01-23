import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger';

const logger = createLogger('TodoAccess');
export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME
  ) {}

  async getAllToDo(userId: string): Promise<{ items: TodoItem[] }> {
    logger.log('Getting all todo', userId)

    const params = {
      TableName: this.todoTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(params).promise()
    logger.log('items', JSON.stringify(result))
    // return result;
    const items = result.Items as TodoItem[]

    return { items }
  }

  async createToDo(todoItem: TodoItem): Promise<{ item: TodoItem }> {
    logger.log('Creating new todo', JSON.stringify(todoItem))

    const params = {
      TableName: this.todoTable,
      Item: todoItem
    }

    const result = await this.docClient.put(params).promise()
    logger.log('result', JSON.stringify(result))

    return { item: todoItem }
  }

  async updateToDo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    logger.log('Updating todo', todoId)

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
      ExpressionAttributeNames: {
        '#a': 'name',
        '#b': 'dueDate',
        '#c': 'done'
      },
      ExpressionAttributeValues: {
        ':a': todoUpdate['name'],
        ':b': todoUpdate['dueDate'],
        ':c': todoUpdate['done']
      },
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()
    logger.log('result', JSON.stringify(result))
    const attributes = result.Attributes

    return attributes as TodoUpdate
  }

  async deleteToDo(todoId: string, userId: string): Promise<string> {
    logger.log('Deleting todo', todoId)

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    const result = await this.docClient.delete(params).promise()
    logger.log('result', JSON.stringify(result))

    return '' as string
  }

  async generateUploadUrl(todoId: string, userId:string): Promise<string> {
    logger.log('Generating URL', todoId)
    try {
      const url = this.s3Client.getSignedUrl('putObject', {
        Bucket: this.s3BucketName,
        Key: todoId,
        Expires: 1000
      })
      logger.log('url', url)
      await this.updateImage(todoId, userId, url);
      return url as string
    } catch (err) {
      logger.error(JSON.stringify(err))
    }
  }

  async updateImage(
    todoId: string,
    userId: string,
    url: string
  ): Promise<string> {
    logger.log('Updating image', todoId)

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #a = :a',
      ExpressionAttributeNames: {
        '#a': 'attachmentUrl',
      },
      ExpressionAttributeValues: {
        ':a': url.split('?')[0]
      },
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()
    logger.log('result', JSON.stringify(result))
   

    return url;
  }
}
