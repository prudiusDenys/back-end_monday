import {Response, Request, Router} from 'express';
import {commentsRepositoryQuery} from '../repositories/comments-repository/comments-repositoryQuery';
import {commentsRepository} from '../repositories/comments-repository/comments-repository';
import {body, validationResult} from 'express-validator';
import {authMiddlewareBearer} from '../middlewares/authMiddlewareBearer';
import {likesRepository} from '../repositories/likes-repository/likes-repository';
import {likesRepositoryQuery} from '../repositories/likes-repository/likes-repositoryQuery';
import {jwtService} from '../application/jwt-service';
import {settings} from '../settings';

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
  const comment = await commentsRepositoryQuery.findComment(req.params.id)
  const likesCount = await likesRepositoryQuery.getLikesCount(req.params.id)
  const dislikesCount = await likesRepositoryQuery.getDislikesCount(req.params.id)

  let myStatus = 'None'

  const result = await jwtService.verifyUserByToken(req.cookies.refreshToken, settings.JWT_SECRET_REFRESH)

  if(result){
     myStatus = await likesRepositoryQuery.getMyStatus(req.params.id, result.userId)
  }

  const mappedComment = {
    ...comment,
    likesInfo: {
      likesCount,
      dislikesCount,
      myStatus
    }
  }

  if (comment) {
    res.status(200).json(mappedComment)
  } else {
    res.sendStatus(404)
  }
})

commentsRouter.put('/:commentId', authMiddlewareBearer,
  body('content').isString().trim().isLength({min: 20, max: 300})
    .withMessage({message: 'content is incorrect', field: 'content'}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = await commentsRepository.updateComment(req.params.commentId, req.body.content, req.user)

    if (result.status === 204) {
      res.sendStatus(204)
    } else if (result.status === 403) {
      res.sendStatus(403)
    } else {
      res.sendStatus(404)
    }
  })

commentsRouter.put('/:commentId/like-status',
  authMiddlewareBearer,
  body('likeStatus').custom((value) => {
    const validValues = ['None', 'Like', 'Dislike']

    if (!validValues.includes(value)) {
      return Promise.reject({message: 'likeStatus is incorrect', field: 'likeStatus'})
    } else {
      return true
    }
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = await likesRepository.updateLikeStatus(req.user.id, req.params.commentId, req.body.likeStatus)

    if (result) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)
    }
  })

commentsRouter.delete('/:commentId', authMiddlewareBearer, async (req: Request, res: Response) => {
  const result = await commentsRepository.deleteComment(req.params.commentId, req.user)

  if (result.status === 204) {
    res.sendStatus(204)
  } else if (result.status === 403) {
    res.sendStatus(403)
  } else {
    res.sendStatus(404)
  }
})
