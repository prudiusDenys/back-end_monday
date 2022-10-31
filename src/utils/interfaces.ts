export interface Blog {
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
  createdAt: string
}

export interface User {
  id: string
  login: string
  email: string
  createdAt: string
  password: string
}

export interface Comment {
  id: string
  content: string
  userId: string
  userLogin: string
  createdAt: string
  parentId: string
}
// Query Params

export interface QueryParams {
  pageNumber: string
  pageSize: string
  sortBy: string
  sortDirection: string
}

export interface BlogsQueryParams extends QueryParams {
  searchNameTerm: string
}

export interface UsersQueryParams extends QueryParams {
  searchLoginTerm: string
  searchEmailTerm: string
}

// Errors

interface ErrorsMessages {
  "message": string
  "field": string
}

export interface ErrorMessage {
  errorsMessages: ErrorsMessages[]
}
