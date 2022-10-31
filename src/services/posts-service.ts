import {PostInputValue, postsRepository} from '../repositories/posts-repository/posts-repository';
import {blogsRepositoryQuery} from '../repositories/blogs-repository/blogs-repositoryQuery';
import {postsRepositoryQuery} from '../repositories/posts-repository/posts-repositoryQuery';
import {handlePostsErrors} from '../utils/handleErrors';
import {Comment, Post, User} from '../utils/interfaces';
import {homework3Posts} from '../repositories/db';

export const postsService = {
  async createPost(data: PostInputValue, blogId: string) {
    const errorMessage = handlePostsErrors(data)

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const foundBlogger = await blogsRepositoryQuery.findBlogger(blogId)
    const date = Number(new Date())

    if (foundBlogger) {
      const newPost: Post = {
        id: date.toString(),
        blogName: foundBlogger.name,
        createdAt: new Date().toISOString(),
        title: data.title,
        blogId: blogId,
        content: data.content,
        shortDescription: data.shortDescription
      }
      await postsRepository.createPost(newPost)

      return {value: newPost}
    }
    return foundBlogger
  },
  async editPost(id: string, data: PostInputValue) {
    const errorMessage = handlePostsErrors(data);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    let post = await postsRepositoryQuery.findPost(id)

    if (post) {
      const res = await postsRepository.editPost(id, data)
      if (res) {
        return {status: 'success'}
      } else {
        return {status: 'notFound'}
      }
    }
    return {status: 'notFound'}
  },
  async deletePost(id: string) {
    const res = await postsRepository.deletePost(id)
    if (res > 0) {
      return {status: 'success'}
    }
    return {status: 'notFound'}
  },
  async createComment(postId: string, content: string, user: User): Promise<Comment | null> {
    const post = await homework3Posts.findOne({id: postId})

    if (!post) return null

    const comment: Comment = {
      id: post.id,
      content,
      userId: user.id,
      userLogin: user.login,
      createdAt: new Date().toISOString(),
      // parentId: ''
    }

    await postsRepository.createComment({...comment})

    return comment

  }
}
