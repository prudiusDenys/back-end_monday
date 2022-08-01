export interface Bloggers {
  id: number
  name: string
  youtubeUrl: string
}

export interface Posts {
  id: number
  title: string
  shortDescription: string
  content: string
  bloggerId: number
  bloggerName: string
}

interface ErrorsMessages {
  "message": string
  "field": string
}

export interface ErrorMessage {
  errorsMessages: Array<ErrorsMessages>
}
