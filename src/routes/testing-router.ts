import {Request, Response, Router} from 'express';
import {bloggers} from './bloggers-router';
import {posts} from './posts-router';
import {videos} from '../repositories/videos-repository';

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
  bloggers.splice(0, bloggers.length)
  posts.splice(0, posts.length)
  videos.splice(0, videos.length)
  res.sendStatus(204)
})
