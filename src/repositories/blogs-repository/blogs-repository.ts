import {Blog} from '../../utils/interfaces';
import {blogs} from '../db';

export const blogsRepository = {
  async createBlogger(newUser: Blog) {
    await blogs.insertOne(newUser)
  },
  async editBlogger(id: string, name: string, youtubeUrl: string) {
    const res = await blogs.updateOne({id}, {
      $set: {name, youtubeUrl}
    })
    return res.matchedCount
  },
  async deleteBlogger(id: string) {
    const res = await blogs.deleteOne({id})
    return res.deletedCount
  }
}
