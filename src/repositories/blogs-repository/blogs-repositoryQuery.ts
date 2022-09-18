import {Blogger} from '../../utils/interfaces';
import {homework3Blogs} from '../db';

export const blogsRepositoryQuery = {
  async getAllBloggers(): Promise<Blogger[]> {
    return await homework3Blogs.find({}).toArray()
  },
  async findBlogger(id: string): Promise<Blogger | null> {
    return await homework3Blogs.findOne({id})
  }
}
