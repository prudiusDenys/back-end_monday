import {MongoClient} from "mongodb";
import {Blogger, Post} from '../utils/interfaces';

const mongoUri = process.env.mongoURI || 'mongodb+srv://Denis:Zimmer483@it-inkubatordbcluster.defijof.mongodb.net/?retryWrites=true&w=majority'

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
