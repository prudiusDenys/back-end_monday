import {Blog} from '../../utils/interfaces';
import {blogs} from '../db';

export const blogsRepository = {
  async createBlogger(newUser: Blog) {
    await blogs.insertOne(newUser)
  },
  async editBlogger(id: string, name: string, websiteUrl: string) {
    const res = await blogs.updateOne({id}, {
      $set: {name, websiteUrl}
    })
    return res.matchedCount
  },
  async deleteBlogger(id: string) {
    const res = await blogs.deleteOne({id})
    return res.deletedCount
  }
}
