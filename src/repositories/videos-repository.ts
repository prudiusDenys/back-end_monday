import {Video} from '../utils/interfaces';


export let videos: Video[] = [
  {
    id: 1,
    title: "About JS - 01",
    author: "it-incubator.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-08-29T16:29:54.567Z",
    publicationDate: "2022-08-29T16:29:54.567Z",
    availableResolutions: [
      "P144"
    ]
  },
  {
    id: 2,
    title: "About JS - 02",
    author: "it-incubator.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-08-29T16:29:54.567Z",
    publicationDate: "2022-08-29T16:29:54.567Z",
    availableResolutions: [
      "P144"
    ]
  },
  {
    id: 3,
    title: "About JS - 03",
    author: "it-incubator.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-08-29T16:29:54.567Z",
    publicationDate: "2022-08-29T16:29:54.567Z",
    availableResolutions: [
      "P144"
    ]
  },
  {
    id: 4,
    title: "About JS - 04",
    author: "it-incubator.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-08-29T16:29:54.567Z",
    publicationDate: "2022-08-29T16:29:54.567Z",
    availableResolutions: [
      "P144"
    ]
  },
  {
    id: 5,
    title: "About JS - 05",
    author: "it-incubator.eu",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2022-08-29T16:29:54.567Z",
    publicationDate: "2022-08-29T16:29:54.567Z",
    availableResolutions: [
      "P144"
    ]
  }
]

interface CreateVideo {
  "title": string
  "author": string
  "availableResolutions": Array<string>
}

interface EditVideo {
  title: string
  author: string
  availableResolutions: Array<string>,
  canBeDownloaded: boolean
  minAgeRestriction: number
  publicationDate: string
}

export const videosRepository = {
  getAllVideos() {
    return videos
  },
  findVideo(id: number) {
    return videos.find(video => video.id == id)
  },
  createVideo(data: CreateVideo) {
    const newVideo: Video = {
      id: +(new Date()),
      title: data.title,
      author: data.author,
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: "2022-08-29T16:29:54.567Z",
      publicationDate: "2022-08-29T16:29:54.567Z",
      availableResolutions: data.availableResolutions
    }
    videos.push(newVideo)
    return newVideo
  },
  editVideo(id: number, data: EditVideo) {
    let foundVideo = videos.find(video => video.id === id);
    if (foundVideo) {
      foundVideo = {...foundVideo, ...data}
      return {status: 'success'}
    }
    return {status: 'notFound'}
  },
  removeVideo(id: number) {
    const video = videos.find(item => item.id === id)
    if (video) {
      videos = videos.filter(video => video.id !== id)
      return {status: 'success'}
    }
    return {status: 'notFound'}
  }
}
