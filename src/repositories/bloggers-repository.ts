import {Bloggers} from '../utils/interfaces';
import {handleBloggersErrors} from '../utils/handleErrors';

export let bloggers: Array<Bloggers> = [
  {id: 11, name: 'Denis', youtubeUrl: 'https://youtu.be/uaYzPV2pSL4'},
  {id: 12, name: 'Andrei', youtubeUrl: 'https://youtu.be/HudXvOlQfrQ'},
  {id: 13, name: 'John', youtubeUrl: 'https://youtu.be/PFSJgBECNeU'},
  {id: 14, name: 'Marcello', youtubeUrl: 'https://youtu.be/uaYzPV2pSL4'},
  {id: 15, name: 'Jakob', youtubeUrl: 'https://youtu.be/PFSJgBECNeU'},
]

export const bloggersRepository = {
  getAllBloggers() {
    return bloggers
  },
  findBlogger(id: number) {
    return bloggers.find(blogger => blogger.id === id)
  },
  createBlogger(name: string, youtubeUrl: string) {
    const errorMessage = handleBloggersErrors(name, youtubeUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const newUser = {id: +(new Date()), name, youtubeUrl}
    bloggers.push(newUser)

    return {value: newUser}
  },
  editBlogger(id: number, name: string, youtubeUrl: string) {
    const errorMessage = handleBloggersErrors(name, youtubeUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const blogger = bloggers.find(blogger => blogger.id === id)
    if (blogger) {
      blogger.name = name
      blogger.youtubeUrl = youtubeUrl
    } else {
      return {status: 'notFound'}
    }
  },
  deleteBlogger(id: number) {
    const blogger = bloggers.find(blogger => blogger.id === id)
    if (blogger) {
      bloggers = bloggers.filter(blogger => blogger.id !== id)
      return {status: 'success'}
    }
    return {status: 'notFound'}
  }
}
