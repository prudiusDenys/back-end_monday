import express, {NextFunction, Request, Response} from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {postsRouter} from './routes/posts-router';
import {videoRouter} from './routes/video-router';
import {bloggersRouter} from './routes/bloggers-router';
import {testingRouter} from './routes/testing-router';

const app = express()
const port = process.env.PORT || 3000

app.use(cors(), bodyParser.json())


// const authGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   if (req.path === 'videos') {
//     next()
//   } else {
//     res.send(401)
//   }
// }
//
// app.use(authGuardMiddleware)


// если что-то начинается на /posts, то тогда
// router перехватывает управление и смотрит какая дальше идет часть и потом дергает конкретный обработчик
app.use('/videos', videoRouter)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
