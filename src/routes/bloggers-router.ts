import {Request, RequestHandler, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {normalizeAllBlogsAndPosts, removeMongoId} from '../utils/normalizeData';
import {blogsService} from '../services/blogs-service';
import {blogsRepositoryQuery, QueryData} from '../repositories/blogs-repository/blogs-repositoryQuery';
import {postsService} from '../services/posts-service';

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request<unknown, unknown, unknown, QueryData >, res: Response) => {
  const data = await blogsRepositoryQuery.getAllBloggers(req.query)

  const normalizedBlogs = normalizeAllBlogsAndPosts(data)

  res.status(200).json(normalizedBlogs)
})

bloggersRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
  const data = await blogsRepositoryQuery.geAllPostsOfBlog(req.query, req.params.blogId)

  if (data.items.length) {
    const normalizedPostsOfBlog = normalizeAllBlogsAndPosts(data)
    res.status(200).json(normalizedPostsOfBlog)
  } else {
    res.sendStatus(404)
  }
})

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
  const blogger: any = await blogsRepositoryQuery.findBlogger(req.params.id)

  if (blogger) {
    const normalizedBlog = removeMongoId(blogger)
    res.status(200).json(normalizedBlog);
  } else {
    res.sendStatus(404);
  }
})

bloggersRouter.post('/', authMiddleware, async (req: Request, res: Response) => {
  const {name, youtubeUrl} = req.body

  const data: any = await blogsService.createBlogger(name, youtubeUrl)

  if (data?.value) {
    const normalizedBlog = removeMongoId(data.value)
    res.status(201).json(normalizedBlog)
  } else {
    res.status(400).json(data.error)
  }
})

bloggersRouter.post('/:blogId/posts', authMiddleware, async (req: Request, res: Response) => {
  const data: any = await postsService.createPost({...req.body, blogId: req.params.blogId})

  if (data?.value) {
    const normalizedPost = removeMongoId(data.value)
    res.status(201).json(normalizedPost)
  } else if (data?.error) {
    res.status(400).json(data.error)
  } else {
    res.sendStatus(404)
  }
})

bloggersRouter.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const id = req.params.id;
  const {name, youtubeUrl} = req.body

  const data = await blogsService.editBlogger(id, name, youtubeUrl)

  if (data.status === 'success') {
    res.sendStatus(204)
  }
  if (data.status === 'notFound') {
    res.sendStatus(404)
  }
  if (data.error) {
    res.status(400).json(data.error)
  }
})

bloggersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const data = await blogsService.deleteBlogger(req.params.id)

  if (data.status === 'success') {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})
