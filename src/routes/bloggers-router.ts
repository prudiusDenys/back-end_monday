import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {bloggersRepository} from '../repositories/bloggers-repository';
import {removeMongoId} from '../utils/normalizeData';

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request, res: Response) => {
  const allBloggers = await bloggersRepository.getAllBloggers()

  const normalizedBlogs = removeMongoId(allBloggers)

  res.status(200).json(normalizedBlogs)
})

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
  const blogger: any = await bloggersRepository.findBlogger(req.params.id)

  if (blogger) {
    const normalizedBlog = removeMongoId(blogger)
    res.status(200).json(normalizedBlog);
  } else {
    res.sendStatus(404);
  }
})

bloggersRouter.post('/', authMiddleware, async (req: Request, res: Response) => {
  const {name, youtubeUrl} = req.body

  const data: any = await bloggersRepository.createBlogger(name, youtubeUrl)

  if (data?.value) {
    const normalizedBlog = removeMongoId(data.value)
    res.status(201).json(normalizedBlog)
  } else {
    res.status(400).json(data.error)
  }
})

bloggersRouter.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const id = req.params.id;
  const {name, youtubeUrl} = req.body

  const data = await bloggersRepository.editBlogger(id, name, youtubeUrl)

  if (data.status === 'success') {
    res.sendStatus(204)
  }
  if (data.error) {
    res.status(400).json(data.error)
  }
  if (data.status === 'notFound') {
    res.sendStatus(404)
  }
})

bloggersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const data = await bloggersRepository.deleteBlogger(req.params.id)

  if (data.status === 'success') {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})
