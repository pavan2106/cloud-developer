import { TodoItem } from '../models/TodoItem'
//import { parseUserId } from '../auth/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/TodoAccess'
import { createLogger } from '../utils/logger'
const logger = createLogger('todos');
const uuidv4 = require('uuid/v4')
const todoAccess = new TodoAccess()

export async function getAllToDo(userId: string): Promise<TodoItem[]> {
  logger.info('getAllToDo', userId);
  return todoAccess.getAllToDo(userId)
}

export function createToDo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = uuidv4()
  const s3BucketName = process.env.S3_BUCKET_NAME
  logger.info('createToDo', userId);
  return todoAccess.createToDo({
    userId: userId,
    todoId: todoId,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createTodoRequest
  })
}

export function updateToDo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<TodoUpdate> {
  return todoAccess.updateToDo(updateTodoRequest, todoId, userId)
}

export function deleteToDo(todoId: string, userId: string): Promise<string> {
  return todoAccess.deleteToDo(todoId, userId)
}

export function generateUploadUrl(todoId: string): Promise<string> {
  return todoAccess.generateUploadUrl(todoId)
}
// export function generateUploadUrl(todoId: string): Promise<string> {
//     return toDoAccess.generateUploadUrl(todoId);
// }
// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils'
// import { TodoItem } from '../models/TodoItem'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
// import * as uuid from 'uuid'
// import * as createError from 'http-errors'
// //import { int } from 'aws-sdk/clients/datapipeline'

// // TODO: Implement businessLogic
// export async function createTodo(
//   request: CreateTodoRequest
// ): Promise<TodoItem> {
//   createLogger(request.name)
//   return {
//     userId: '',
//     todoId: '',
//     createdAt: '',
//     name: '',
//     dueDate: '',
//     done: true,
//     attachmentUrl: ''
//   }
// }

// export async function deleteTodo(
//     id: string
//   ): Promise<boolean> {
//     createLogger(id)
//     return true;
//   }

  // export async function createAttachmentPresignedUrl( id: string) : Promise<boolean> {
  //   createLogger(id)
  //   return true;
  // }

//   export async function getTodosForUser(
//     id: string
//   ): Promise<TodoItem[]> {
//     createLogger(id)

//     return [{
//       userId: '',
//       todoId: '',
//       createdAt: '',
//       name: '',
//       dueDate: '',
//       done: true,
//       attachmentUrl: ''
//     }];
//   }

//   export async function updateTodo(id:string,
//     request:UpdateTodoRequest
//   ): Promise<UpdateTodoRequest> {
//     createLogger(id)
//     return request;
//   }
