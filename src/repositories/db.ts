import {MongoClient} from "mongodb";
import {Blogger} from '../utils/interfaces';

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri);

export const homework3 = client.db('bloggers-posts').collection<Blogger>('bloggers')

export async function runDb() {
  try {
    await client.connect()
  } catch {
    await client.close()
  }
}
