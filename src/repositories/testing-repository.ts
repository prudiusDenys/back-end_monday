import {videos} from './videos-repository';
import {comments, homework3Blogs, homework3Posts, users} from './db';


export const testingRepository = {
  async removeAllData() {
    videos.splice(0, videos.length)
    await homework3Posts.deleteMany({})
    await homework3Blogs.deleteMany({})
    await users.deleteMany({})
    await comments.deleteMany({})
  }
}
