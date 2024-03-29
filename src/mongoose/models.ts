import mongoose from 'mongoose';
import {AuthDeviceSessionSchema, BlogSchema, CommentSchema, LikesSchema, PostSchema, UserSchema} from './schemas';

export const Blogs = mongoose.model('bloggers', BlogSchema)
export const Posts = mongoose.model('posts', PostSchema)
export const Users = mongoose.model('users', UserSchema)
export const Comments = mongoose.model('comments', CommentSchema)
export const Likes = mongoose.model('likes', LikesSchema)
export const AuthDevicesSessions = mongoose.model('authDevicesSessions', AuthDeviceSessionSchema)


