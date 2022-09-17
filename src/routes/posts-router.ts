import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {postsRepository} from '../repositories/posts-repository';

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
  const posts = await postsRepository.getAllPosts()

  const normalizedData = posts.map((item: any) => {
    delete item['_id']
    return item
  })

  res.status(200).json(normalizedData)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
  const post: any = await postsRepository.findPost(req.params.id)

  if (post) {
    delete post['_id']
    res.status(200).json(post);
  } else {
    res.sendStatus(404);
  }
})

postsRouter.post('/', authMiddleware, async (req: Request, res: Response) => {
  const data: any = await postsRepository.createPost(req.body)

  if (data.error) {
    res.status(400).json(data.error)
  } else if (data.value) {
    delete data.value['_id']
    res.status(201).json(data.value)
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
