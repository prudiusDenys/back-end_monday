
import {videos} from './videos-repository';
import {posts} from './posts-repository';
import {bloggers} from './bloggers-repository';


export const testingRepository = {
  removeAllData() {
    bloggers.splice(0, bloggers.length)
    posts.splice(0, posts.length)
    videos.splice(0, videos.length)
  }
}
