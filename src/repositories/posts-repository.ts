import {Post} from '../utils/interfaces';
import {handlePostsErrors} from '../utils/handleErrors';
import {homework3} from './db';

export let posts: Post[] = [
  {id: 1, title: 'Moscow', bloggerId: 11, bloggerName: 'Denis', content: 'blabla', shortDescription: 'aboutUs1'},
  {id: 2, title: 'Moscow', bloggerId: 12, bloggerName: 'Misha', content: 'blabla1', shortDescription: 'aboutUs2'},
  {id: 3, title: 'Moscow', bloggerId: 13, bloggerName: 'Kolya', content: 'blabla2', shortDescription: 'aboutUs3'},
  {id: 4, title: 'Moscow', bloggerId: 14, bloggerName: 'Sasha', content: 'blabla3', shortDescription: 'aboutUs4'},
  {id: 5, title: 'Moscow', bloggerId: 15, bloggerName: 'Luda', content: 'blabla4', shortDescription: 'aboutUs5'},
]

export const postsRepository = {
  getAllPosts() {
    return posts
  },
  findPost(id: number) {
    return  posts.find(post => post.id === id)
  },
  async createPost(data: any) {
    const errorMessage = handlePostsErrors(data)

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    //const foundBlogger = bloggers.find(blogger => blogger.id === data.bloggerId)
    const foundBlogger = await homework3.findOne({id: data.bloggerId})

    if (foundBlogger) {
      const newPost = {
        id: +(new Date()),
        bloggerName: foundBlogger.name,
        ...data
      }
      posts.push(newPost)
      return {value: newPost}
    }
  },
  editPost(id: number, data: any) {
    const errorMessage = handlePostsErrors(data);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    let post = posts.find(post => post.id === id)
    if (post) {
      post.title = data.title
      post.shortDescription = data.shortDescription
      post.content = data.content
      post.bloggerId = data.bloggerId
      return {status: 'success'}
    }
    return {status: 'notFound'}
  },
  deletePost(id: number) {
    const post = posts.find(post => post.id === id)

    if (post) {
      posts = posts.filter(blogger => blogger.id !== id)
      return {status: 'success'}
    }
    return {status: 'notFound'}
  }
}
