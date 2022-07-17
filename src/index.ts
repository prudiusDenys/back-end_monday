import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

app.use(
  cors(),
  bodyParser.json()
)

const port = process.env.PORT || 3000

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
  const errorMessage = {
    "errorsMessages": [
      {
        "message": "id is incorrect",
        "field": "id"
      }
    ]
  }
  res.status(404).send(errorMessage)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
