import {Blog} from '../utils/interfaces';
import {handleBloggersErrors} from '../utils/handleErrors';
import {Blogs} from '../mongoose/models';
import {log} from 'util';

const blog = new Blogs()

export const blogsService = {
  async createBlogger(name: string, websiteUrl: string, description: string) {
    const errorMessage = handleBloggersErrors(name, websiteUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const date = Number(new Date())

    const newUser: Blog = {
      id: date.toString(),
      name,
      websiteUrl,
      description,
      createdAt: new Date().toISOString()
    }

    await blog.createBlogger(newUser)
    //await blog.save() app is crashed

    return {value: newUser}
  },
  async editBlogger(id: string, name: string, websiteUrl: string, description: string) {
    const errorMessage = handleBloggersErrors(name, websiteUrl);

    if (errorMessage.errorsMessages.length) {
      return {error: errorMessage}
    }

    const res = await blog.editBlogger(id, name, websiteUrl, description)
    await blog.save()

    if (res) {
      return {status: 'success'}
    } else {
      return {status: 'notFound'}
    }
  },
  async deleteBlogger(id: string) {



    const res = await blog.deleteBlogger(id)
    await blog.save()
    return res > 0;
  }
}
