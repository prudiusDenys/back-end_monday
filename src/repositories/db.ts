import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

const mongoUriMongoose = process.env.mongoURI || 'mongodb+srv://Denis:Zimmer483@it-inkubatordbcluster.defijof.mongodb.net/'
const dbName = 'bloggers-posts'

export async function runDb() {
  try {
    await mongoose.connect(mongoUriMongoose + dbName);
  } catch {
    await mongoose.connection.close()
  }
}
