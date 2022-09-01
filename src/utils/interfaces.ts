export interface Bloggers {
  id: number
  name: string
  youtubeUrl: string
}

export interface Post {
  id: number
  title: string
  shortDescription: string
  content: string
  bloggerId: number
  bloggerName: string
}

export interface Video  {
  "id": number
  "title": string
  "author": string
  "canBeDownloaded": boolean
  "minAgeRestriction": null | number
  "createdAt": string
  "publicationDate": string
  "availableResolutions": Array<string>
}

interface ErrorsMessages {
  "message": string
  "field": string
}

export interface ErrorMessage {
  errorsMessages: Array<ErrorsMessages>
}
