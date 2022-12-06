import {Blog} from '../../utils/interfaces';
import {Blogs} from '../db';

export const blogsRepository = {
  async createBlogger(newUser: Blog) {
    await Blogs.create(newUser)
  },
  async editBlogger(id: string, name: string, websiteUrl: string, description: string) {
    const res = await Blogs.updateOne({id}, {
      $set: {name, websiteUrl, description}
    })
    return res.matchedCount
  },
  async deleteBlogger(id: string) {
    const res = await Blogs.deleteOne({id})
    return res.deletedCount
  }
}
