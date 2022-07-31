import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {type} from 'os';

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

interface Bloggers {
  id: number
  name: string
  youtubeUrl: string
}

let bloggers: Array<Bloggers> = [
  {id: 1, name: 'Denis', youtubeUrl: 'https://youtu.be/uaYzPV2pSL4'},
  {id: 2, name: 'Andrei', youtubeUrl: 'https://youtu.be/HudXvOlQfrQ'},
  {id: 3, name: 'John', youtubeUrl: 'https://youtu.be/PFSJgBECNeU'},
  {id: 4, name: 'Marcello', youtubeUrl: 'https://youtu.be/uaYzPV2pSL4'},
  {id: 5, name: 'Jakob', youtubeUrl: 'https://youtu.be/PFSJgBECNeU'},
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
  const regexp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/


  if (!name || typeof youtubeUrl !== 'string' || name.length > 15) {
    const errorMessage = {
      "errorsMessages": [
        {
          "message": "name is incorrect",
          "field": "name"
        }
      ]
    }
    res.send(errorMessage)
    return;
  }

  if (!youtubeUrl || youtubeUrl.length > 100 || !regexp.exec(youtubeUrl)) {
    const errorMessage = {
      "errorsMessages": [
        {
          "message": "youtubeUrl is incorrect",
          "field": "youtubeUrl"
        }
      ]
    }
    res.send(errorMessage)
    return;
  }

  const newUser = {
    id: +(new Date()),
    name,
    youtubeUrl
  }
  bloggers.push(newUser)
  res.status(201).send(newUser)
})

app.put('/bloggers/:id', (req: Request, res: Response) => {
  const id = +req.params.id;
  const {name, youtubeUrl} = req.body
  const regexp = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/

  if (!name || typeof youtubeUrl !== 'string' || name.length > 15) {
    const errorMessage = {
      "errorsMessages": [
        {
          "message": "name is incorrect",
          "field": "name"
        }
      ]
    }
    res.status(400).send(errorMessage)
    return;
  }

  if (!youtubeUrl || youtubeUrl.length > 100 || !regexp.exec(youtubeUrl)) {
    const errorMessage = {
      "errorsMessages": [
        {
          "message": "youtubeUrl is incorrect",
          "field": "youtubeUrl"
        }
      ]
    }
    res.status(400).send(errorMessage)
    return;
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
