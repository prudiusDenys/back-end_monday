import {Video, videos} from '../../routes/video-router';

export const videoRepositoryQuery = {
  findAllVideos(): Video[] {
    return videos
  },
  findVideo(id: number): Video | undefined {
    return videos.find(video => video.id === id)
  }
}
