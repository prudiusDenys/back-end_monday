import {Request, Response, Router} from 'express';
import {handlePostsErrors} from '../utils/handleErrors';
import {Posts} from '../utils/interfaces';
import {bloggers} from './bloggers-router';
import {authMiddleware} from '../middlewares/authMiddleware';

export let posts: Array<Posts> = [
  {id: 1, title: 'Moscow', bloggerId: 11, bloggerName: 'Denis', content: 'blabla', shortDescription: 'aboutUs1'},
  {id: 2, title: 'Moscow', bloggerId: 12, bloggerName: 'Misha', content: 'blabla1', shortDescription: 'aboutUs2'},
  {id: 3, title: 'Moscow', bloggerId: 13, bloggerName: 'Kolya', content: 'blabla2', shortDescription: 'aboutUs3'},
  {id: 4, title: 'Moscow', bloggerId: 14, bloggerName: 'Sasha', content: 'blabla3', shortDescription: 'aboutUs4'},
  {id: 5, title: 'Moscow', bloggerId: 15, bloggerName: 'Luda', content: 'blabla4', shortDescription: 'aboutUs5'},
]

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
  res.status(200).send(posts)
})
postsRouter.get('/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const post = posts.find(blogger => blogger.id === id)
  if (post) {
    res.status(200).send(post);
    return;
  }
  res.sendStatus(404);
})
postsRouter.post('/', authMiddleware, (req: Request, res: Response) => {

  const {bloggerId} = req.body

  const errorMessage = handlePostsErrors(req.body)

  if (errorMessage.errorsMessages.length) {
    res.status(401).send(errorMessage)
    return
  }

  const foundBlogger = bloggers.find(blogger => blogger.id === bloggerId)
  if (foundBlogger) {
    const newPost = {
      id: +(new Date()),
      bloggerName: foundBlogger.name,
      ...req.body
    }
    posts.push(newPost)
    res.status(201).send(newPost)
  }
})
postsRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const id = +req.params.id;
  const {title, shortDescription, content, bloggerId} = req.body

  const errorMessage = handlePostsErrors(req.body);

  if (errorMessage.errorsMessages.length) {
    res.status(401).send(errorMessage)
    return
  }

  let post = posts.find(post => post.id === id)
  if (post) {
    post.title = title
    post.shortDescription = shortDescription
    post.content = content
    post.bloggerId = bloggerId
    res.sendStatus(204)
    return;
  }
  res.sendStatus(404)
})
postsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  const id = +req.params.id
  const post = posts.find(post => post.id === id)
  if (post) {
    posts = posts.filter(blogger => blogger.id !== id)
    res.sendStatus(204)
    return
  }
  res.sendStatus(404)
})
