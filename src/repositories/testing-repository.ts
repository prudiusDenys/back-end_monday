import {videos} from './videos-repository';
import {posts} from './posts-repository';
import {homework3} from './db';


export const testingRepository = {
  async removeAllData() {
    posts.splice(0, posts.length)
    videos.splice(0, videos.length)
    await homework3.deleteMany({})
  }
}
