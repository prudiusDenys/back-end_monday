export interface Blogger {
  id: string
  name: string
  youtubeUrl: string
  createdAt: string
}

export interface Post {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
}

export interface Video {
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
