export let videos = [
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

export const videosRepository = {
  getAllVideos() {
    return videos
  },
  findVideo(id: number) {
    const foundVideo = videos.find(video => video.id == id)
    if (foundVideo) {
      return foundVideo
    }
    return null;
  },
  createVideo(data: any) {
    if (data.title && data.title.length <= 40) {
      const newVideo = {
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
    }
    return {
      "errorsMessages": [
        {
          "message": "title is incorrect",
          "field": "title"
        }
      ]
    }
  },
  removeVideo(id: number) {
    const isId = videos.find(item => item.id === id)
    if (isId) {
      videos = videos.filter(video => video.id !== id)
      return true
    }
    return false
  },
  editVideo(id: number, data: any) {
    const foundVideo = videos.find(video => video.id === id);

    if (data.title && data.title.length <= 40 && foundVideo) {
      foundVideo.title = data.title
      foundVideo.author = data.author
      foundVideo.availableResolutions = data.availableResolutions
      foundVideo.canBeDownloaded = data.canBeDownloaded
      foundVideo.minAgeRestriction = data.minAgeRestriction
      foundVideo.publicationDate = data.publicationDate
      return '204'
    }
    if (!foundVideo) {
      return '404'
    }
    return '400'
  }
}
