import {Blogger} from '../../utils/interfaces';
import {homework3Blogs} from '../db';

export const blogsRepository = {
  async createBlogger(newUser: Blogger) {
    await homework3Blogs.insertOne(newUser)
  },
  async editBlogger(id: string, name: string, youtubeUrl: string) {
    const res = await homework3Blogs.updateOne({id}, {
      $set: {name, youtubeUrl}
    })
    return res.matchedCount
  },
  async deleteBlogger(id: string) {
    const res = await homework3Blogs.deleteOne({id})
    return res.deletedCount
  }
}
