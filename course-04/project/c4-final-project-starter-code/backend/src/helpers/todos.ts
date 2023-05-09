import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'
import {
  createTodoItem,
  deleteTodoItem,
  generateTodItemUploadUrl,
  getAllTodoItems,
  updateTodoItem
} from '../dataAccess/todosAcess'
const logger = createLogger('todos')
const uuidv4 = require('uuid/v4')

const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<{ item: TodoItem }> => {
  const todoId = uuidv4()
  logger.info('createTodo', userId)
  return createTodoItem({
    userId: userId,
    todoId: todoId,
    attachmentUrl: '',
    createdAt: new Date().toString(),
    done: false,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  })
}

const updateTodo = async (
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<TodoUpdate> => {
  logger.info('Updating Todo items', todoId);
  return updateTodoItem(updateTodoRequest, todoId, userId)
}

const deleteTodo = async (todoId: string, userId: string): Promise<string> => {
  logger.info('Deleting Todo items', todoId);
  return deleteTodoItem(todoId, userId)
}

const getAllTodo = async (userId: string): Promise<{ items: TodoItem[] }> => {
  logger.info('get All Todo items', userId);
  return getAllTodoItems(userId)
}

const generateUploadUrl = async (
  todoId: string,
  userId: string
): Promise<string> => {
  return generateTodItemUploadUrl(todoId, userId)
}

export { createTodo, updateTodo, deleteTodo, getAllTodo, generateUploadUrl }
