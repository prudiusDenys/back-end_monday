import {Request, Response, Router} from 'express';

let videos = [
  {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
  {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
  {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
  {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
  {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]

export const videoRouter = Router({})



videoRouter.get('/', (req: Request, res: Response) => {
  let helloMessage = 'hello'
  res.send(helloMessage)
})

videoRouter.get('/', (req: Request, res: Response) => {
  res.send(videos)
})

videoRouter.get('/:videoId', (req: Request, res: Response) => {
  const id = +req.params.videoId
  const foundVideo = videos.find(video => video.id == id)
  if (foundVideo) {
    res.send(foundVideo)
    return
  }
  res.sendStatus(404)
})

videoRouter.post('/', (req: Request, res: Response) => {
  if (req.body.title && req.body.title.length <= 40) {
    const newVideo = {
      id: +(new Date()),
      title: req.body.title,
      author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
    return
  }
  const errorMessage = {
    "errorsMessages": [
      {
        "message": "title is incorrect",
        "field": "title"
      }
    ]
  }
  res.status(400).send(errorMessage)

})

videoRouter.delete('/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const isId = videos.find(item => item.id === id)
  if (isId) {
    videos = videos.filter(video => video.id !== id)
    res.sendStatus(204)
    return
  }
  res.sendStatus(404)
})

videoRouter.put('/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const title = req.body.title
  const foundVideo = videos.find(video => video.id === id);

  if (title && title.length <= 40 && foundVideo) {
    foundVideo.title = title
    res.sendStatus(204)
    return
  }
  if (!foundVideo) {
    res.sendStatus(404);
    return;
  }
  const errorMessage = {
    "errorsMessages": [
      {
        "message": "id is incorrect",
        "field": "title"
      }
    ]
  }
  res.status(400).send(errorMessage)
})
