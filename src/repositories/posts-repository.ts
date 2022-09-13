import {Post} from '../utils/interfaces';
import {handlePostsErrors} from '../utils/handleErrors';
import {homework3Blogs, homework3Posts} from './db';

export const postsRepository = {
  async getAllPosts(): Promise<Post[]> {
    return homework3Posts.find({}).toArray()
  },
  async findPost(id: number): Promise<Post | null> {
    return homework3Posts.findOne({id})
  },
  async createPost(data: any) {
    const errorMessage = handlePostsErrors(data)

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const foundBlogger = await homework3Blogs.findOne({id: data.bloggerId})

    if (foundBlogger) {
      const newPost = {
        id: +(new Date()),
        bloggerName: foundBlogger.name,
        ...data
      }
      await homework3Posts.insertOne(newPost)

      return {value: newPost}
    }
  },
  async editPost(id: number, data: any) {
    const errorMessage = handlePostsErrors(data);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    let post = await homework3Posts.findOne({id})
    if (post) {
      post.title = data.title
      post.shortDescription = data.shortDescription
      post.content = data.content
      post.bloggerId = data.bloggerId
      return {status: 'success'}
    }
    return {status: 'notFound'}
  },
  async deletePost(id: number) {
    const res = await homework3Posts.deleteOne({id})
    if (res.deletedCount > 0) {
      return {status: 'success'}
    }
    return {status: 'notFound'}
  }
}
