import {comments, blogs, posts, users, authDevicesSessions} from './db';
import {videos} from '../routes/video-router';


export const testingRepository = {
  async removeAllData() {
    videos.splice(0, videos.length)
    await posts.deleteMany({})
    await blogs.deleteMany({})
    await users.deleteMany({})
    await comments.deleteMany({})
    await authDevicesSessions.deleteMany({})
  }
}
