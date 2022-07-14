import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(cors())
const jsonParser = bodyParser.json()
const port = 3000

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
  res.send('404 VIDEO NOT FOUND')
})

app.post('/videos', jsonParser, (req: Request, res: Response) => {
  const newVideo = {
    id: +(new Date()),
    title: req.body.title,
    author: 'it-incubator.eu'
  }
  videos.push(newVideo)
  res.send(newVideo)
})

app.delete('/videos/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  videos = videos.filter(video => video.id !== id)
})

app.put('/videos/:id', jsonParser, (req: Request, res: Response) => {
  const id = +req.params.id
  const title = req.body.title
  const foundVideo = videos.find(video => video.id === id);
  if (foundVideo) {
    foundVideo.title = title
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
