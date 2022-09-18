import {Post} from '../utils/interfaces';
import {handlePostsErrors} from '../utils/handleErrors';
import {homework3Blogs, homework3Posts} from './db';

export interface EditPostInputValue {
  title: string
  shortDescription: string
  content: string
  blogId: string
}

export const postsRepository = {
  async getAllPosts(): Promise<Post[]> {
    return homework3Posts.find({}).toArray()
  },
  async findPost(id: string): Promise<Post | null> {
    return homework3Posts.findOne({id})
  },
  async createPost(data: any) {
    const errorMessage = handlePostsErrors(data)

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const foundBlogger = await homework3Blogs.findOne({id: data.blogId})
    const date = Number(new Date())

    if (foundBlogger) {
      const newPost: Post = {
        id: date.toString(),
        blogName: foundBlogger.name,
        createdAt: new Date().toISOString(),
        title: data.title,
        blogId: data.blogId,
        content: data.content,
        shortDescription: data.shortDescription
      }

      await homework3Posts.insertOne(newPost)

      return {value: newPost}
    }
  },
  async editPost(id: string, data: EditPostInputValue) {
    const errorMessage = handlePostsErrors(data);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    let post = await homework3Posts.findOne({id})
    if (post) {
      const res = await homework3Posts.updateOne({id}, {
        $set: {
          title: data.title,
          shortDescription: data.shortDescription,
          content: data.content,
          blogId: data.blogId
        }
      })
      if (res.matchedCount) {
        return {status: 'success'}
      }
      return {status: 'notFound'}
    }
    return {status: 'notFound'}
  },
  async deletePost(id: string) {
    const res = await homework3Posts.deleteOne({id})
    if (res.deletedCount > 0) {
      return {status: 'success'}
    }
    return {status: 'notFound'}
  }
}
