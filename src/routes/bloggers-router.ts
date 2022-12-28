import {Request, Response, Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {normalizeAllBlogsAndPosts, removeMongoId} from '../utils/normalizeData';
import {blogsService} from '../services/blogs-service';
import {blogsRepositoryQuery} from '../repositories/blogs-repository/blogs-repositoryQuery';
import {PostsService} from '../services/posts-service';
import {BlogsQueryParams} from '../utils/interfaces';

export const bloggersRouter = Router({})

bloggersRouter.get('/', async (req: Request<{}, {}, {}, BlogsQueryParams>, res: Response) => {
  const allBloggers = await blogsRepositoryQuery.getAllBloggers(req.query)
  res.status(200).json(allBloggers)
})

bloggersRouter.get('/:blogId/posts', async (req: Request<any, {}, {}, BlogsQueryParams>, res: Response) => {
  const data = await blogsRepositoryQuery.geAllPostsOfBlog(req.query, req.params.blogId)

  if (data.items.length) {
    const normalizedPostsOfBlog = normalizeAllBlogsAndPosts(data)
    res.status(200).json(normalizedPostsOfBlog)
  } else {
    res.sendStatus(404)
  }
})

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
  const blogger = await blogsRepositoryQuery.findBlogger(req.params.id)

  if (blogger) {
    res.status(200).json(blogger);
  } else {
    res.sendStatus(404);
  }
})

bloggersRouter.post('/', authMiddleware, async (req: Request, res: Response) => {
  const {name, websiteUrl, description} = req.body

  const data = await blogsService.createBlogger(name, websiteUrl, description)

  if (data?.value) {
    const normalizedBlog = removeMongoId(data.value)
    res.status(201).json(normalizedBlog)
  } else {
    res.status(400).json(data.error)
  }
})

bloggersRouter.post('/:blogId/posts', authMiddleware, async (req: Request, res: Response) => {
  const postsService = new PostsService()
  const data: any = await postsService.createPost(req.body, req.params.blogId)

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
  const {name, websiteUrl, description} = req.body

  const data = await blogsService.editBlogger(id, name, websiteUrl, description)

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
  const response = await blogsService.deleteBlogger(req.params.id)

  if (response) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})
