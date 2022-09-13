import {Blogger} from '../utils/interfaces';
import {handleBloggersErrors} from '../utils/handleErrors';
import {homework3} from './db';


export const bloggersRepository = {
  async getAllBloggers(): Promise<Blogger[]> {
    return await homework3.find({}).toArray()
  },
  async findBlogger(id: number): Promise<Blogger | null> {
    return await homework3.findOne({id})
  },
  async createBlogger(name: string, youtubeUrl: string) {
    const errorMessage = handleBloggersErrors(name, youtubeUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const newUser = {
      id: +(new Date()),
      name,
      youtubeUrl,
      createdAt: '2022-09-13T18:26:09.391Z'
    }
    await homework3.insertOne(newUser)

    return {value: newUser}
  },
  async editBlogger(id: number, name: string, youtubeUrl: string) {
    const errorMessage = handleBloggersErrors(name, youtubeUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const res = await homework3.updateOne({id}, {
      $set: {name, youtubeUrl}
    })

    if (!res.matchedCount) {
      return {status: 'notFound'}
    } else {
      return {status: 'success'}
    }
  },
  async deleteBlogger(id: number) {
    const res = await homework3.deleteOne({id})
    if (res.deletedCount > 0) {
      return {status: 'success'}
    } else {
      return {status: 'notFound'}
    }
  }
}
