import { VideoItem } from '../models/VideoItem'
import { VideoRequest } from '../requests/VideoRequest'
import { VideoUpdate } from '../models/VideoUpdate'
import { createLogger } from '../utils/logger'
import {
  createVideoItem,
  deleteVideoItem,
  generateVideoItemUploadUrl,
  getAllVideoItems,
  updateVideoItem
} from '../dataAccess/videosAccess'
const logger = createLogger('Videos')
const uuidv4 = require('uuid/v4')

const createVideo = async (
  videoRequest: VideoRequest,
  userId: string
): Promise<{ item: VideoItem }> => {
  const videoId = uuidv4()
  logger.info('createVideo', userId)
  return createVideoItem({
    userId: userId,
    videoId: videoId,
    url: '',
    createdAt: new Date().toISOString(),
    title: videoRequest.title,
    updatedAt: new Date().toISOString()
  })
}

const updateVideo = async (
  videoRequest: VideoRequest,
  videoId: string,
  userId: string
): Promise<VideoUpdate> => {
  logger.info('Updating Video items', videoId)
  return updateVideoItem(
    { title: videoRequest.title, updatedAt: new Date().toISOString() },
    videoId,
    userId
  )
}

const deleteVideo = async (
  videoId: string,
  userId: string
): Promise<string> => {
  logger.info('Deleting Video items', videoId)
  return deleteVideoItem(videoId, userId)
}

const getAllVideo = async (userId: string): Promise<{ items: VideoItem[] }> => {
  logger.info('get All Video items', userId)
  return getAllVideoItems(userId)
}

const generateVideoUploadUrl = async (
  videoId: string,
  userId: string
): Promise<string> => {
  return generateVideoItemUploadUrl(videoId, userId)
}

export { createVideo, updateVideo, deleteVideo, getAllVideo, generateVideoUploadUrl };
