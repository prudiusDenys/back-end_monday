import {videoRepositoryQuery} from '../repositories/video-repository/video-repositoryQuery';
import {uuid} from 'uuidv4';
import {videoRepository} from '../repositories/video-repository/video-repository';
import {Resolutions, Video, videos} from '../routes/video-router';

interface CreateUserModel {
  title: string
  author: string
  availableResolutions: Resolutions[]
}

interface UpdateUserModel {
  title: string
  author: string
  availableResolutions: Resolutions[],
  canBeDownloaded: boolean,
  minAgeRestriction: number,
  publicationDate: string
}

export const videoService = {
  createVideo(createUserData: CreateUserModel): Video {

    const newVideo: Video = {
      id: Number(new Date),
      title: createUserData.title,
      author: createUserData.author,
      availableResolutions: createUserData.availableResolutions,
      createdAt: new Date().toISOString(),
      canBeDownloaded: true,
      minAgeRestriction: null,
      publicationDate: new Date().toISOString()
    }

    videoRepository.createUser(newVideo)

    return newVideo
  },
  updateVideo(updateVideoData: UpdateUserModel, id: number): boolean {
    const video = videoRepositoryQuery.findVideo(id)

    if (video) {
      video.title = updateVideoData.title
      video.author = updateVideoData.author
      video.availableResolutions = updateVideoData.availableResolutions
      video.canBeDownloaded = updateVideoData.canBeDownloaded
      video.minAgeRestriction = updateVideoData.minAgeRestriction
      video.publicationDate = updateVideoData.publicationDate
      return true
    } else {
      return false
    }
  }
}
