import {Comment, Post} from '../../utils/interfaces';
import {comments, posts} from '../db';

export interface PostInputValue {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export const postsRepository = {
  async createPost(newPost: Post) {
    await posts.insertOne(newPost)
  },
  async editPost(id: string, data: PostInputValue) {
    const res = await posts.updateOne({id}, {
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
    const res = await posts.deleteOne({id})
    return res.deletedCount
  },
  async createComment(comment: Comment) {
    await comments.insertOne(comment)
  }
}
