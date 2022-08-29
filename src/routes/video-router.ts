import {Request, Response, Router} from 'express';
import {videosRepository} from '../repositories/videos-repository';

export const videoRouter = Router({})


videoRouter.get('/', (req: Request, res: Response) => {
  const videos = videosRepository.getAllVideos()
  res.send(videos)
})

videoRouter.get('/:videoId', (req: Request, res: Response) => {
  const id = +req.params.videoId
  const video = videosRepository.findVideo(id)
  if (video) {
    res.send(video)
    return
  }
  res.sendStatus(404)
})

videoRouter.post('/', (req: Request, res: Response) => {
  const data: any = videosRepository.createVideo(req.body.title)
  if (data.errorsMessages) {
    res.status(400).send(data)
    return;
  }
  res.status(201).send(data)
})

videoRouter.delete('/:id', (req: Request, res: Response) => {
  const isRemoved = videosRepository.removeVideo(+req.params.id)
  if (isRemoved) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})

videoRouter.put('/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const title = req.body.title

  const data = videosRepository.editVideo(id, title)

  switch (data) {
    case '204':
      res.sendStatus(204)
      break
    case '400':
      res.status(400).send({
        "errorsMessages": [
          {
            "message": "id is incorrect",
            "field": "title"
          }
        ]
      })
      break
    default:
      res.sendStatus(404)
  }
})
