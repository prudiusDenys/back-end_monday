import {Request, Response, Router} from 'express';
import {videosRepository} from '../repositories/videos-repository';
import {Video} from '../utils/interfaces';


export const videoRouter = Router({})

videoRouter.get('/', (req: Request, res: Response) => {
  const videos: Video[] = videosRepository.getAllVideos()
  res.status(200).json(videos)
})

videoRouter.get('/:videoId', (req: Request, res: Response) => {
  const video: Video | undefined = videosRepository.findVideo(+req.params.videoId)

  if (video) {
    res.status(200).json(video)
  } else {
    res.sendStatus(404)
  }
})

videoRouter.post('/', (req: Request, res: Response) => {
  const data: Video = videosRepository.createVideo(req.body)
  res.status(201).json(data)
})

videoRouter.put('/:id', (req: Request, res: Response) => {
  const data = videosRepository.editVideo(+req.params.id, req.body)

  if (data.status === 'success') {
    res.sendStatus(204)
  }
  if (data.status === 'notFound') {
    res.sendStatus(404)
  }
})

videoRouter.delete('/:id', (req: Request, res: Response) => {
  const data = videosRepository.removeVideo(+req.params.id)

  if (data.status === 'success') {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})
