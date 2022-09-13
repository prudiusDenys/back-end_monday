import {videos} from './videos-repository';
import {homework3Blogs, homework3Posts} from './db';


export const testingRepository = {
  async removeAllData() {
    videos.splice(0, videos.length)
    await homework3Posts.deleteMany({})
    await homework3Blogs.deleteMany({})
  }
}
