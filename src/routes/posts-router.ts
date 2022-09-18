import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {postsRepository} from '../repositories/posts-repository';
import {removeMongoId} from '../utils/normalizeData';

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
  const posts = await postsRepository.getAllPosts()

  const normalizedPosts = removeMongoId(posts)

  res.status(200).json(normalizedPosts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
  const post = await postsRepository.findPost(req.params.id)

  if (post) {
    const normalizedPost = removeMongoId(post)
    res.status(200).json(normalizedPost);
  } else {
    res.sendStatus(404);
  }
})

postsRouter.post('/', authMiddleware, async (req: Request, res: Response) => {
  const data: any = await postsRepository.createPost(req.body)

  if(data?.value){
    const normalizedPost = removeMongoId(data.value)
    res.status(201).json(normalizedPost)
  }
  if(data?.error){
    res.status(400).json(data.error)
  } else {
    res.sendStatus(404)
  }
})

postsRouter.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const data: any = await postsRepository.editPost(req.params.id, req.body)

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

postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const status = await postsRepository.deletePost(req.params.id)

  if (status.status === 'success') {
    res.sendStatus(204)
  }
  if (status.status === 'notFound') {
    res.sendStatus(404)
  }
})
