import {Request, Response, Router} from 'express';
import {videoRepositoryQuery} from '../repositories/video-repository/video-repositoryQuery';
import {videoService} from '../services/video-service';
import {body, validationResult} from 'express-validator';

export enum Resolutions {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160'
}

export interface Video {
  id: number
  title: string
  author: string
  canBeDownloaded: boolean
  minAgeRestriction: number | null
  createdAt: string
  publicationDate: string
  availableResolutions: Resolutions[]
}

export let videos: Video[] = []


export const videoRouter = Router({})

videoRouter.get('/', (req: Request, res: Response) => {
  const allVideos = videoRepositoryQuery.findAllVideos()
  res.status(200).json(allVideos)
})

videoRouter.get('/:id', (req: Request, res: Response) => {
  const video = videoRepositoryQuery.findVideo(+req.params.id)

  if (video) {
    res.status(200).json(video)
  } else {
    res.sendStatus(404)
  }
})

videoRouter.post('/',
  body('title').isString().trim()
    .withMessage({message: 'title is incorrect', field: 'title'})
    .isLength({max: 40})
    .withMessage({message: 'author is incorrect', field: 'author'}),
  body('author').isString().trim()
    .withMessage({message: 'author is incorrect', field: 'author'})
    .isLength({max: 20})
    .withMessage({message: 'author is incorrect', field: 'author'}),
  body('availableResolutions').isArray()
    .withMessage({message: 'availableResolutions is incorrect', field: 'availableResolutions'}),
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array())
      console.log(errors.array())
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const createdVideo = videoService.createVideo(req.body)
    res.status(201).json(createdVideo)
  })

videoRouter.put('/:id',
  body('title').isString().trim().isLength({max: 40})
    .withMessage({message: 'title is incorrect', field: 'title'}),
  body('author').isString().trim().isLength({max: 20})
    .withMessage({message: 'author is incorrect', field: 'author'}),
  body('availableResolutions').isArray()
    .withMessage({message: 'availableResolutions is incorrect', field: 'availableResolutions'}),
  body('canBeDownloaded').isBoolean()
    .withMessage({message: 'canBeDownloaded is incorrect', field: 'canBeDownloaded'}),
  body('minAgeRestriction').isInt({min: 1, max: 18})
    .withMessage({message: 'minAgeRestriction is incorrect', field: 'minAgeRestriction'}),
  body('publicationDate').isString().trim()
    .withMessage({message: 'publicationDate is incorrect', field: 'publicationDate'}),
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = videoService.updateVideo(req.body, +req.params.id)

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }

  })

videoRouter.delete('/:id', (req: Request, res: Response) => {
  const video = videoRepositoryQuery.findVideo(+req.params.id)

  if (video) {
    videos = videos.filter(video => video.id !== +req.params.id)
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})
