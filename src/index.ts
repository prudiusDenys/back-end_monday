import express from 'express'
import cors from 'cors'
import {postsRouter} from './routes/posts-router';
import {bloggersRouter} from './routes/bloggers-router';
import {removingAllRouter} from './routes/removingAll-router';
import {runDb} from './repositories/db';
import {usersRouter} from './routes/users-router';
import {authRouter} from './routes/auth-router';
import {commentsRouter} from './routes/comments-router';
import cookieParser from 'cookie-parser';
import {videoRouter} from './routes/video-router';
import {securityDevicesRouter} from './routes/securityDevices-router';

const app = express()
const port = process.env.PORT || 3000

app.set('trust proxy', true)
app.use(cors(), express.json())
app.use(cookieParser())

//routes
app.use('/videos', videoRouter)
app.use('/blogs', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/testing', removingAllRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityDevicesRouter)

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startApp().catch(() => console.dir())
