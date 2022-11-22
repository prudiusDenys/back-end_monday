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

interface AccountData {
  login: string
  email: string
  password: string
  createdAt: string
}

interface EmailConfirmation {
  confirmationCode: string
  expirationDate: Date
  isConfirmed: boolean
}

export interface AuthDeviceSession {
  ip: string
  title: string
  lastActivatedDate: string
  expiredDate: string
  deviceId: string
  userId: string
}

export interface User {
  id: string,
  accountData: AccountData,
  emailConfirmation: EmailConfirmation
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
