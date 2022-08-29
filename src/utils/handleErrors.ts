import {ErrorMessage, Posts} from './interfaces';
import {bloggers} from '../routes/bloggers-router';

export const handleBloggersErrors = (name: string, youtubeUrl: string) => {
  const errorMessage: ErrorMessage = {
    errorsMessages: []
  }

  const regexp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

  if (!name || !name.trim() || typeof youtubeUrl !== 'string' || name.length > 15) {
    errorMessage.errorsMessages.push({
      message: "name is incorrect",
      field: "name"
    })
  }
  if (!youtubeUrl || youtubeUrl.length > 100 || !regexp.exec(youtubeUrl)) {
    errorMessage.errorsMessages.push({
      "message": "youtubeUrl is incorrect",
      "field": "youtubeUrl"
    })
  }
  return errorMessage
}
export const handlePostsErrors = ({title, shortDescription, content, bloggerId}: Posts) => {
  const errorMessage: ErrorMessage = {
    errorsMessages: []
  }
  if (!title || !title.trim() || typeof title !== 'string' || title.length > 30) {
    errorMessage.errorsMessages.push({
      message: "title is incorrect",
      field: "title"
    })
  }

  if (!shortDescription || !shortDescription.trim() || typeof shortDescription !== 'string' || shortDescription.length > 100) {
    errorMessage.errorsMessages.push({
      message: "shortDescription is incorrect",
      field: "shortDescription"
    })
  }

  if (!content || !content.trim() || typeof content !== 'string' || content.length > 1000) {
    errorMessage.errorsMessages.push({
      message: "content is incorrect",
      field: "content"
    })
  }

  if (!bloggerId || !Number.isInteger(bloggerId) || typeof bloggerId !== 'number') {
    errorMessage.errorsMessages.push({
      message: "bloggerId is incorrect",
      field: "bloggerId"
    })
  }

  const foundBlogger = bloggers.find(blogger => blogger.id === bloggerId)
  if(!foundBlogger){
    errorMessage.errorsMessages.push({
      message: "bloggerId is incorrect",
      field: "bloggerId"
    })
  }

  return errorMessage
}
