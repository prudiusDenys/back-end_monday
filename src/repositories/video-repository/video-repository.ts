import {Video, videos} from '../../routes/video-router';

export const videoRepository = {
  createUser(createdVideo: Video) {
    videos.push(createdVideo)
  }
}
