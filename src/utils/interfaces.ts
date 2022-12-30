export interface Likes {
  parentId: string //commentID
  userId: string // user who set like
  myStatus: 'None' | 'Like' | 'Dislike'
}

export interface Blog {
  id: string
  name: string
  websiteUrl: string
  createdAt: string
  description: string
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

export interface Comment {
  id: string
  content: string
  userId: string
  userLogin: string
  createdAt: string
  parentId: string
}

export interface Account {
  login: string
  email: string
  password: string
  createdAt: string
}

export interface EmailConfirmationData {
  confirmationCode: string
  expirationDate: Date
  isConfirmed: boolean
}

export interface AuthDeviceSession {
  ip: string
  title: string
  lastActiveDate: string
  expiredDate: string
  deviceId: string
  userId: string
  expiredRefreshTokens: string[]
}

export interface User {
  id: string,
  accountData: Account,
  emailConfirmation: EmailConfirmationData
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
