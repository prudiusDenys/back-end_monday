import {Blogger} from '../utils/interfaces';
import {handleBloggersErrors} from '../utils/handleErrors';
import {homework3Blogs} from './db';


export const bloggersRepository = {
  async getAllBloggers(): Promise<Blogger[]> {
    return await homework3Blogs.find({}).toArray()
  },
  async findBlogger(id: string): Promise<Blogger | null> {
    return await homework3Blogs.findOne({id})
  },
  async createBlogger(name: string, youtubeUrl: string) {
    const errorMessage = handleBloggersErrors(name, youtubeUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const date = Number(new Date())

    const newUser: Blogger = {
      id: date.toString(),
      name,
      youtubeUrl,
      createdAt: new Date().toISOString(),
    }

    await homework3Blogs.insertOne(newUser)

    return {value: newUser}
  },
  async editBlogger(id: string, name: string, youtubeUrl: string) {
    const errorMessage = handleBloggersErrors(name, youtubeUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const res = await homework3Blogs.updateOne({id}, {
      $set: {name, youtubeUrl}
    })

    if (!res.matchedCount) {
      return {status: 'notFound'}
    } else {
      return {status: 'success'}
    }
  },
  async deleteBlogger(id: string) {
    const res = await homework3Blogs.deleteOne({id})
    if (res.deletedCount > 0) {
      return {status: 'success'}
    } else {
      return {status: 'notFound'}
    }
  }
}
