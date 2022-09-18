import {Post} from '../../utils/interfaces';
import {homework3Posts} from '../db';

export const postsRepositoryQuery = {
  async getAllPosts(): Promise<Post[]> {
    return homework3Posts.find({}).toArray()
  },
  async findPost(id: string): Promise<Post | null> {
    return homework3Posts.findOne({id})
  }
}
