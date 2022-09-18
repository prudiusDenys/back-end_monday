import {MongoClient} from "mongodb";
import {Blogger, Post} from '../utils/interfaces';

const mongoUri = process.env.mongoURI || 'mongodb+srv://Denis:Zimmer483@it-inkubatordbcluster.defijof.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(mongoUri);
const bloggersPostsDb = client.db('bloggers-posts')

export const homework3Blogs = bloggersPostsDb.collection<Blogger>('bloggers')
export const homework3Posts = bloggersPostsDb.collection<Post>('posts')

export async function runDb() {
  try {
    await client.connect()
  } catch {
    await client.close()
  }
}
