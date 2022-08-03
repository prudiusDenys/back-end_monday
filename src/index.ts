import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {postsRouter} from './routes/posts-router';
import {videoRouter} from './routes/video-router';
import {bloggersRouter} from './routes/bloggers-router';

const app = express()
const port = process.env.PORT || 3000

app.use(cors(), bodyParser.json())
// если что-то начинается на /posts, то тогда
// router перехватывает управление и смотрит какая дальше идет часть и потом дергает конкретный обработчик
app.use('/videos', videoRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
