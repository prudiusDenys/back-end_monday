import {Post} from '../../utils/interfaces';
import {homework3Posts} from '../db';

export interface PostInputValue {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export const postsRepository = {
  async createPost(newPost: Post) {
    await homework3Posts.insertOne(newPost)
  },
  async editPost(id: string, data: PostInputValue) {
    const res = await homework3Posts.updateOne({id}, {
      $set: {
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId
      }
    })
    return res.matchedCount
  },
  async deletePost(id: string) {
    const res = await homework3Posts.deleteOne({id})
    return res.deletedCount
  }
}
