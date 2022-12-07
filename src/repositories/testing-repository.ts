import {videos} from '../routes/video-router';
import {AuthDevicesSessions, Blogs, Comments, Posts, Users} from '../mongoose/models';

export const testingRepository = {
  async removeAllData() {
    videos.splice(0, videos.length)
    await Posts.deleteMany({})
    await Blogs.deleteMany({})
    await Users.deleteMany({})
    await Comments.deleteMany({})
    await AuthDevicesSessions.deleteMany({})
  }
}
