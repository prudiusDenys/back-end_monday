import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {normalizeAllBlogsAndPosts, removeMongoId} from '../utils/normalizeData';
import {postsRepositoryQuery} from '../repositories/posts-repository/posts-repositoryQuery';
import {postsService} from '../services/posts-service';

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
  const data = await postsRepositoryQuery.getAllPosts(req.query)

  const normalizedPosts = normalizeAllBlogsAndPosts(data)

  res.status(200).json(normalizedPosts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
  const post = await postsRepositoryQuery.findPost(req.params.id)

  if (post) {
    const normalizedPost = removeMongoId(post)
    res.status(200).json(normalizedPost);
  } else {
    res.sendStatus(404);
  }
})

postsRouter.post('/', authMiddleware, async (req: Request, res: Response) => {
  const data: any = await postsService.createPost(req.body, req.body.blogId)

  if (data?.value) {
    const normalizedPost = removeMongoId(data.value)
    res.status(201).json(normalizedPost)
  } else if (data?.error) {
    res.status(400).json(data.error)
  } else {
    res.sendStatus(404)
  }
})

postsRouter.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const data: any = await postsService.editPost(req.params.id, req.body)

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
  const status = await postsService.deletePost(req.params.id)

  if (status.status === 'success') {
    res.sendStatus(204)
  }
  if (status.status === 'notFound') {
    res.sendStatus(404)
  }
})
