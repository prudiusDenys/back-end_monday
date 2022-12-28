import {Comment, Post} from '../../utils/interfaces';
import {Comments, Posts} from '../../mongoose/models';

export interface PostInputValue {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export class PostsRepository {
  async createPost(newPost: Post) {
    await Posts.create(newPost)
  }

  async editPost(id: string, data: PostInputValue) {
    const res = await Posts.updateOne({id}, {
      $set: {
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId
      }
    })
    return res.matchedCount
  }

  async deletePost(id: string) {
    const res = await Posts.deleteOne({id})
    return res.deletedCount
  }

  async createComment(comment: Comment) {
    await Comments.create(comment)
  }
}
