let videos = [
  {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
  {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
  {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
  {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
  {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
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
  createVideo(title: string) {
    if (title && title.length <= 40) {
      const newVideo = {
        id: +(new Date()),
        title: title,
        author: 'it-incubator.eu'
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
  editVideo(id: number, title: string) {
    const foundVideo = videos.find(video => video.id === id);

    if (title && title.length <= 40 && foundVideo) {
      foundVideo.title = title
      return '204'
    }
    if (!foundVideo) {
      return '404'
    }
    return '400'
  }
}
