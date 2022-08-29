import {Bloggers} from '../utils/interfaces';
import {Request, Response, Router} from 'express';
import {handleBloggersErrors} from '../utils/handleErrors';
import {authMiddleware} from '../middlewares/authMiddleware';

export let bloggers: Array<Bloggers> = [
  {id: 11, name: 'Denis', youtubeUrl: 'https://youtu.be/uaYzPV2pSL4'},
  {id: 12, name: 'Andrei', youtubeUrl: 'https://youtu.be/HudXvOlQfrQ'},
  {id: 13, name: 'John', youtubeUrl: 'https://youtu.be/PFSJgBECNeU'},
  {id: 14, name: 'Marcello', youtubeUrl: 'https://youtu.be/uaYzPV2pSL4'},
  {id: 15, name: 'Jakob', youtubeUrl: 'https://youtu.be/PFSJgBECNeU'},
]

export const bloggersRouter = Router({})

bloggersRouter.get('/',(req: Request, res: Response) => {
  res.status(200).send(bloggers)
})

bloggersRouter.get('/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const blogger = bloggers.find(blogger => blogger.id === id)
  if (blogger) {
    res.status(200).send(blogger);
    return;
  }
  res.sendStatus(404);
})

bloggersRouter.post('/', authMiddleware, (req: Request, res: Response) => {
  const {name, youtubeUrl} = req.body

  const errorMessage = handleBloggersErrors(name, youtubeUrl);

  if (errorMessage.errorsMessages.length) {
    res.status(401).send(errorMessage)
    return
  }

  const newUser = {id: +(new Date()), name, youtubeUrl}
  bloggers.push(newUser)
  res.status(201).send(newUser)
})

bloggersRouter.put('/:id', authMiddleware, (req: Request, res: Response) => {
  const id = +req.params.id;
  const {name, youtubeUrl} = req.body

  const errorMessage = handleBloggersErrors(name, youtubeUrl);

  if (errorMessage.errorsMessages.length) {
    res.status(401).send(errorMessage)
    return
  }

  const blogger = bloggers.find(blogger => blogger.id === id)
  if (blogger) {
    blogger.name = name
    blogger.youtubeUrl = youtubeUrl
    res.sendStatus(204)
    return;
  }
  res.sendStatus(404)
})

bloggersRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  const id = +req.params.id
  const blogger = bloggers.find(blogger => blogger.id === id)
  if (blogger) {
    bloggers = bloggers.filter(blogger => blogger.id !== id)
    res.sendStatus(204)
    return
  }
  res.sendStatus(404)
})
