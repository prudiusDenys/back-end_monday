import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {bloggersRepository} from '../repositories/bloggers-repository';

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request, res: Response) => {
  const allBloggers = await bloggersRepository.getAllBloggers()

  const normalizedData = allBloggers.map((item: any) => {
    delete item['_id']
    return item
  })

  res.status(200).json(normalizedData)
})

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
  const blogger: any = await bloggersRepository.findBlogger(+req.params.id)

  if (blogger) {
    delete blogger['_id']
    res.status(200).json(blogger);
  } else {
    res.sendStatus(404);
  }
})

bloggersRouter.post('/', authMiddleware, async (req: Request, res: Response) => {
  const {name, youtubeUrl} = req.body

  const data: any= await bloggersRepository.createBlogger(name, youtubeUrl)

  if (data.error) {
    res.status(400).json(data.error)
  } else {
    delete data.value['_id']
    res.status(201).json(data.value)
  }
})

bloggersRouter.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const id = +req.params.id;
  const {name, youtubeUrl} = req.body

  const data = await bloggersRepository.editBlogger(id, name, youtubeUrl)

  if (data.error) {
    res.status(400).json(data.error)
  }
  if (data.status === 'notFound') {
    res.sendStatus(404)
  }
  if (data.status === 'success') {
    res.sendStatus(204)
  }
})

bloggersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const data = await bloggersRepository.deleteBlogger(+req.params.id)

  if (data.status === 'success') {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})
