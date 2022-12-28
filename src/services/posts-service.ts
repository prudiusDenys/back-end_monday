import {PostInputValue, PostsRepository} from '../repositories/posts-repository/posts-repository';
import {blogsRepositoryQuery} from '../repositories/blogs-repository/blogs-repositoryQuery';
import {PostsRepositoryQuery} from '../repositories/posts-repository/posts-repositoryQuery';
import {handlePostsErrors} from '../utils/handleErrors';
import {Comment, Post, User} from '../utils/interfaces';
import {Posts} from '../mongoose/models';

export class PostsService {
  postsRepository: PostsRepository
  postsRepositoryQuery: PostsRepositoryQuery

  constructor() {
    this.postsRepository = new PostsRepository()
    this.postsRepositoryQuery = new PostsRepositoryQuery()
  }

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
      await this.postsRepository.createPost(newPost)

      return {value: newPost}
    }
    return foundBlogger
  }

  async editPost(id: string, data: PostInputValue) {
    const errorMessage = handlePostsErrors(data);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    let post = await this.postsRepositoryQuery.findPost(id)

    if (post) {
      const res = await this.postsRepository.editPost(id, data)
      if (res) {
        return {status: 'success'}
      } else {
        return {status: 'notFound'}
      }
    }
    return {status: 'notFound'}
  }

  async deletePost(id: string) {
    const res = await this.postsRepository.deletePost(id)
    if (res > 0) {
      return {status: 'success'}
    }
    return {status: 'notFound'}
  }

  async createComment(postId: string, content: string, user: User): Promise<Comment | null> {
    const post = await Posts.findOne({id: postId})

    if (!post) return null

    const date = Number(new Date())

    const comment: Comment = {
      id: date.toString(),
      content,
      userId: user.id,
      userLogin: user.accountData.login,
      createdAt: new Date().toISOString(),
      parentId: post.id,
      likeStatus: 'None'
    }

    await this.postsRepository.createComment({...comment})

    const returnedComment: any = {...comment}
    delete returnedComment.likeStatus

    return returnedComment
  }
}
