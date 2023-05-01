import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
const logger = createLogger('todoAcess')
const todoTable = process.env.TODOS_TABLE
const docClient: DocumentClient = new AWS.DynamoDB.DocumentClient()


const createTodoItem = async (todoItem: TodoItem): Promise<{ item: TodoItem }> => {
  logger.log(
    'Creating new todo by ' + todoItem.userId,
    JSON.stringify(todoItem)
  )

  const params = {
    TableName: todoTable,
    Item: todoItem
  }

  const result = await docClient.put(params).promise()
  logger.log('result', JSON.stringify(result))

  return { item: todoItem }
}

const updateTodoItem = async (
  todoUpdate: TodoUpdate,
  todoId: string,
  userId: string
): Promise<TodoUpdate> => {
  logger.log('Updating todo', todoId)

  const params = {
    TableName: todoTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#dueDate': 'dueDate',
      '#done': 'done'
    },
    ExpressionAttributeValues: {
      ':name': todoUpdate['name'],
      ':dueDate': todoUpdate['dueDate'],
      ':done': todoUpdate['done']
    },
    ReturnValues: 'ALL_NEW'
  }

  const result = await docClient.update(params).promise()
  logger.log('result', JSON.stringify(result))
  const attributes = result.Attributes

  return attributes as TodoUpdate
}

const deleteTodoItem = async (todoId: string, userId: string): Promise<string> => {
  logger.log('Deleting todo item ', todoId)

  const params = {
    TableName: todoTable,
    Key: {
      userId: userId,
      todoId: todoId
    }
  }

  const result = await docClient.delete(params).promise()
  logger.log('result', JSON.stringify(result))

  return '' as string
}

const getAllTodoItems = async (userId: string): Promise<{ items: TodoItem[] }> => {
    logger.log('Getting all todo for user', userId)
  
    const params = {
      TableName: todoTable,
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
    const items = result.Items as TodoItem[]
  
    return { items }
  }
  
const generateTodItemUploadUrl = async (
  todoId: string,
  userId: string
): Promise<string> => {
  logger.log('Generating URL for', todoId)
  try {
    const s3Client = new AWS.S3({ signatureVersion: 'v4' })
    const s3BucketName = process.env.S3_BUCKET_NAME

    const url = s3Client.getSignedUrl('putObject', {
      Bucket: s3BucketName,
      Key: todoId,
      Expires: 100
    });
    logger.log('url', url);
    await updateTodoImage(todoId, userId, url);
    return url;
  } catch (err) {
    logger.error(JSON.stringify(err))
  }
}

const updateTodoImage = async (
  todoId: string,
  userId: string,
  url: string
): Promise<string> => {
  logger.log('Updating image by ' + userId, todoId)

  const params = {
    TableName: todoTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
    ExpressionAttributeNames: {
      '#attachmentUrl': 'attachmentUrl'
    },
    ExpressionAttributeValues: {
      ':attachmentUrl': url.split('?')[0]
    },
    ReturnValues: 'ALL_NEW'
  }

  const result = await docClient.update(params).promise()
  logger.log('result', JSON.stringify(result))
  return url
}

export {
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
  getAllTodoItems,
  generateTodItemUploadUrl
}
