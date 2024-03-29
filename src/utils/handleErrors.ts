import {ErrorMessage} from './interfaces';
import {Blogs} from '../mongoose/models';

interface PostsErrorType {
  title: string,
  shortDescription: string,
  content: string,
  blogId?: string
}

export const handleBloggersErrors = (name: string, websiteUrl: string, blogId?: string) => {
  const errorMessage: ErrorMessage = {
    errorsMessages: []
  }

  const regexp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

  if (!name || !name.trim() || typeof websiteUrl !== 'string' || name.length > 15) {
    errorMessage.errorsMessages.push({
      message: "name is incorrect",
      field: "name"
    })
  }
  if (!websiteUrl || websiteUrl.length > 100 || !regexp.exec(websiteUrl)) {
    errorMessage.errorsMessages.push({
      "message": "websiteUrl is incorrect",
      "field": "websiteUrl"
    })
  }

  if (blogId) {
    if (typeof blogId !== 'string' || blogId.length > 13) {
      errorMessage.errorsMessages.push({
        message: "blogId is incorrect",
        field: "blogId"
      })
    }
  }

  return errorMessage
}

export const handlePostsErrors = ({title, shortDescription, content, blogId}: PostsErrorType) => {
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

  if (blogId) {
    if (typeof blogId !== 'string' || blogId.length > 13) {
      errorMessage.errorsMessages.push({
        message: "blogId is incorrect",
        field: "blogId"
      })
    }
  }

  const foundBlogger = Blogs.findOne({id: blogId})
  if (!foundBlogger) {
    errorMessage.errorsMessages.push({
      message: "bloggerId is incorrect",
      field: "bloggerId"
    })
  }

  return errorMessage
}
