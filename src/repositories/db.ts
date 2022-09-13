import {MongoClient} from "mongodb";
import {Blogger, Post} from '../utils/interfaces';

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri);

export const homework3Blogs = client.db('bloggers-posts').collection<Blogger>('bloggers')
export const homework3Posts = client.db('bloggers-posts').collection<Post>('posts')

export async function runDb() {
  try {
    await client.connect()
  } catch {
    await client.close()
  }
}
