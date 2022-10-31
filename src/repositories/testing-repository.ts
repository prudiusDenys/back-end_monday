import {comments, blogs, posts, users} from './db';


export const testingRepository = {
  async removeAllData() {
    // videos.splice(0, videos.length)
    await posts.deleteMany({})
    await blogs.deleteMany({})
    await users.deleteMany({})
    await comments.deleteMany({})
  }
}
