import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {type} from 'os';
import {handleBloggersErrors, handlePostsErrors} from './utils/handleErrors';
import {Bloggers, Posts} from './utils/interfaces';

const app = express()

app.use(
  cors(),
  bodyParser.json()
)

const port = process.env.PORT || 3000

//Videos

let videos = [
  {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
  {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
  {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
  {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
  {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]

app.get('/', (req: Request, res: Response) => {
  let helloMessage = 'hello'
  res.send(helloMessage)
})

app.get('/videos', (req: Request, res: Response) => {
  res.send(videos)
})

app.get('/videos/:videoId', (req: Request, res: Response) => {
  const id = +req.params.videoId
  const foundVideo = videos.find(video => video.id == id)
  if (foundVideo) {
    res.send(foundVideo)
    return
  }
  res.sendStatus(404)
})

app.post('/videos', (req: Request, res: Response) => {
  if (req.body.title && req.body.title.length <= 40) {
    const newVideo = {
      id: +(new Date()),
      title: req.body.title,
      author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
    return
  }
  const errorMessage = {
    "errorsMessages": [
      {
        "message": "title is incorrect",
        "field": "title"
      }
    ]
  }
  res.status(400).send(errorMessage)

})

app.delete('/videos/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const isId = videos.find(item => item.id === id)
  if (isId) {
    videos = videos.filter(video => video.id !== id)
    res.sendStatus(204)
    return
  }
  res.sendStatus(404)
})

app.put('/videos/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const title = req.body.title
  const foundVideo = videos.find(video => video.id === id);

  if (title && title.length <= 40 && foundVideo) {
    foundVideo.title = title
    res.sendStatus(204)
    return
  }
  if (!foundVideo) {
    res.sendStatus(404);
    return;
  }
  const errorMessage = {
    "errorsMessages": [
      {
        "message": "id is incorrect",
        "field": "title"
      }
    ]
  }
  res.status(400).send(errorMessage)
})


// Bloggers

let bloggers: Array<Bloggers> = [
  {id: 11, name: 'Denis', youtubeUrl: 'https://youtu.be/uaYzPV2pSL4'},
  {id: 12, name: 'Andrei', youtubeUrl: 'https://youtu.be/HudXvOlQfrQ'},
  {id: 13, name: 'John', youtubeUrl: 'https://youtu.be/PFSJgBECNeU'},
  {id: 14, name: 'Marcello', youtubeUrl: 'https://youtu.be/uaYzPV2pSL4'},
  {id: 15, name: 'Jakob', youtubeUrl: 'https://youtu.be/PFSJgBECNeU'},
]

app.get('/bloggers', (req: Request, res: Response) => {
  res.status(200).send(bloggers)
})

app.get('/bloggers/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const blogger = bloggers.find(blogger => blogger.id === id)
  if (blogger) {
    res.status(200).send(blogger);
    return;
  }
  res.sendStatus(404);
})

app.post('/bloggers', (req: Request, res: Response) => {
  const {name, youtubeUrl} = req.body

  const errorMessage = handleBloggersErrors(name, youtubeUrl);

  if (errorMessage.errorsMessages.length) {
    res.status(400).send(errorMessage)
    return
  }

  const newUser = {id: +(new Date()), name, youtubeUrl}
  bloggers.push(newUser)
  res.status(201).send(newUser)
})

app.put('/bloggers/:id', (req: Request, res: Response) => {
  const id = +req.params.id;
  const {name, youtubeUrl} = req.body

  const errorMessage = handleBloggersErrors(name, youtubeUrl);

  if (errorMessage.errorsMessages.length) {
    res.status(400).send(errorMessage)
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

app.delete('/bloggers/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const blogger = bloggers.find(blogger => blogger.id === id)
  if (blogger) {
    bloggers = bloggers.filter(blogger => blogger.id !== id)
    res.sendStatus(204)
    return
  }
  res.sendStatus(404)
})


// posts

let posts: Array<Posts> = [
  {id: 1, title: 'Moscow', bloggerId: 11, bloggerName: 'Denis', content: 'blabla', shortDescription: 'aboutUs1'},
  {id: 2, title: 'Moscow', bloggerId: 12, bloggerName: 'Misha', content: 'blabla1', shortDescription: 'aboutUs2'},
  {id: 3, title: 'Moscow', bloggerId: 13, bloggerName: 'Kolya', content: 'blabla2', shortDescription: 'aboutUs3'},
  {id: 4, title: 'Moscow', bloggerId: 14, bloggerName: 'Sasha', content: 'blabla3', shortDescription: 'aboutUs4'},
  {id: 5, title: 'Moscow', bloggerId: 15, bloggerName: 'Luda', content: 'blabla4', shortDescription: 'aboutUs5'},
]


app.get('/posts', (req: Request, res: Response) => {
  res.status(200).send(posts)
})

app.get('/posts/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const post = posts.find(blogger => blogger.id === id)
  if (post) {
    res.status(200).send(post);
    return;
  }
  res.sendStatus(404);
})

app.post('/posts', (req: Request, res: Response) => {

  const errorMessage = handlePostsErrors(req.body)

  if (errorMessage.errorsMessages.length) {
    res.status(400).send(errorMessage)
    return
  }

    const newPost = {
      id: +(new Date()),
      bloggerName: 'denis',
      ...req.body
    }
    posts.push(newPost)
    res.status(201).send(newPost)
})

app.put('/posts/:id', (req: Request, res: Response) => {
  const id = +req.params.id;
  const {title, shortDescription, content, bloggerId, bloggerName} = req.body

  const errorMessage = handlePostsErrors(req.body);

  if (errorMessage.errorsMessages.length) {
    res.status(400).send(errorMessage)
    return
  }

  let post = posts.find(post => post.id === id)
  if (post) {
    post.title = title
    post.shortDescription = shortDescription
    post.content = content
    post.bloggerId = bloggerId
    post.bloggerName = bloggerName
    res.sendStatus(204)
    return;
  }
  res.sendStatus(404)
})

app.delete('/posts/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const post = posts.find(post => post.id === id)
  if (post) {
    posts = posts.filter(blogger => blogger.id !== id)
    res.sendStatus(204)
    return
  }
  res.sendStatus(404)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
