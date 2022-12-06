import {MongoClient} from "mongodb";
import mongoose from 'mongoose'
import {AuthDeviceSession, Blog, Comment, Post, User} from '../utils/interfaces';

mongoose.set('strictQuery', false)

const mongoUri = process.env.mongoURI || 'mongodb+srv://Denis:Zimmer483@it-inkubatordbcluster.defijof.mongodb.net/?retryWrites=true&w=majority'
const mongoUriMongoose = process.env.mongoURI || 'mongodb+srv://Denis:Zimmer483@it-inkubatordbcluster.defijof.mongodb.net/'

const client = new MongoClient(mongoUri);
const bloggersPostsDb = client.db('bloggers-posts')

export const posts = bloggersPostsDb.collection<Post>('posts')
export const users = bloggersPostsDb.collection<User>('users')
export const comments = bloggersPostsDb.collection<Comment>('comments')
export const authDevicesSessions = bloggersPostsDb.collection<AuthDeviceSession>('authDevicesSessions')

const BlogSchema = new mongoose.Schema<Blog>({
  id: {type: String, required: true},
  name: {type: String, required: true},
  websiteUrl: {type: String, required: true},
  createdAt: {type: String, required: true},
  description: {type: String, required: true}
})

export const Blogs = mongoose.model('bloggers', BlogSchema)

export async function runDb() {
  try {
    await client.connect()
    await mongoose.connect(mongoUriMongoose + 'bloggers-posts');
  } catch {
    await client.close()
    await mongoose.connection.close()
  }
}
