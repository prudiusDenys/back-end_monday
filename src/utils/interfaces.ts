export interface Bloggers {
  id: number
  name: string
  youtubeUrl: string
}

interface ErrorsMessages {
  "message": string
  "field": string
}

export interface ErrorMessage {
  errorsMessages: Array<ErrorsMessages>
}
