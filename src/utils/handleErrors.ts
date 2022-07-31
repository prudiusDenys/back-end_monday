import {ErrorMessage} from './interfaces';


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
