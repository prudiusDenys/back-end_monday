import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {postsRepository} from '../repositories/posts-repository';
import {Post} from '../utils/interfaces';


export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
  const posts: Post[] = postsRepository.getAllPosts()
  res.status(200).json(posts)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
  const post: Post | undefined = postsRepository.findPost(+req.params.id)

  if (post) {
    res.status(200).json(post);
  } else {
    res.sendStatus(404);
  }
})

postsRouter.post('/', authMiddleware, (req: Request, res: Response) => {
  const data: any = postsRepository.createPost(req.body)

  if (data?.error) {
    res.status(400).json(data.error)
  } else if (data?.value) {
    res.status(201).json(data.value)
  }
})

postsRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const data: any = postsRepository.editPost(+req.params.id, req.body)

  if (data?.error) {
    res.status(400).json(data.error)
  }
  if (data.status === 'success') {
    res.sendStatus(204)
  }
  if (data.status === 'notFound') {
    res.sendStatus(404)
  }
})

postsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  const status = postsRepository.deletePost(+req.params.id)

  if (status.status === 'success') {
    res.sendStatus(204)
  }
  if (status.status === 'notFound') {
    res.sendStatus(404)
  }
})
