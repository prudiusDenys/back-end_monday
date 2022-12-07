import mongoose from 'mongoose';
import {Account, AuthDeviceSession, Blog, Comment, EmailConfirmationData, Post, User} from '../utils/interfaces';

const AccountSchema = new mongoose.Schema<Account>({
  login: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  createdAt: {type: String, required: true}
})
const EmailConfirmation = new mongoose.Schema<EmailConfirmationData>({
  confirmationCode: {type: String, required: true},
  expirationDate: {type: Date, required: true},
  isConfirmed: {type: Boolean, required: true}
})

export const BlogSchema = new mongoose.Schema<Blog>({
  id: {type: String, required: true},
  name: {type: String, required: true},
  websiteUrl: {type: String, required: true},
  createdAt: {type: String, required: true},
  description: {type: String, required: true}
})
export const PostSchema = new mongoose.Schema<Post>({
  id: {type: String, required: true},
  title: {type: String, required: true},
  createdAt: {type: String, required: true},
  blogId: {type: String, required: true},
  blogName: {type: String, required: true},
  content: {type: String, required: true},
  shortDescription: {type: String, required: true}
})
export const UserSchema = new mongoose.Schema<User>({
  id: {type: String, required: true},
  accountData: {type: AccountSchema, required: true},
  emailConfirmation: {type: EmailConfirmation, required: true}
})
export const CommentSchema = new mongoose.Schema<Comment>({
  id: {type: String, required: true},
  content: {type: String, required: true},
  userId: {type: String, required: true},
  userLogin: {type: String, required: true},
  createdAt: {type: String, required: true},
  parentId: {type: String, required: true}
})
export const AuthDeviceSessionSchema = new mongoose.Schema<AuthDeviceSession>({
  ip: {type: String, required: true},
  title: {type: String, required: true},
  lastActiveDate: {type: String, required: true},
  expiredDate: {type: String, required: true},
  deviceId: {type: String, required: true},
  userId: {type: String, required: true},
  expiredRefreshTokens: {type: [String], required: true}
})
