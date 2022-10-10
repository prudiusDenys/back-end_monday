import {Blog} from '../utils/interfaces';
import {handleBloggersErrors} from '../utils/handleErrors';
import {blogsRepository} from '../repositories/blogs-repository/blogs-repository';

export const blogsService = {
  async createBlogger(name: string, youtubeUrl: string) {
    const errorMessage = handleBloggersErrors(name, youtubeUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const date = Number(new Date())

    const newUser: Blog = {
      id: date.toString(),
      name,
      youtubeUrl,
      createdAt: new Date().toISOString(),
    }

    await blogsRepository.createBlogger(newUser)

    return {value: newUser}
  },
  async editBlogger(id: string, name: string, youtubeUrl: string) {
    const errorMessage = handleBloggersErrors(name, youtubeUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const res = await blogsRepository.editBlogger(id, name, youtubeUrl)

    if (res) {
      return {status: 'success'}
    } else {
      return {status: 'notFound'}
    }
  },
  async deleteBlogger(id: string) {
    const res = await blogsRepository.deleteBlogger(id)

    if (res > 0) {
      return {status: 'success'}
    } else {
      return {status: 'notFound'}
    }
  }
}
