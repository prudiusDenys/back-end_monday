import {Response, Request, Router} from 'express';
import {commentsRepositoryQuery} from '../repositories/comments-repository/comments-repositoryQuery';
import {commentsRepository} from '../repositories/comments-repository/comments-repository';
import {body, validationResult} from 'express-validator';
import {authMiddlewareBearer} from '../middlewares/authMiddlewareBearer';

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
  const comment = await commentsRepositoryQuery.findComment(req.params.id)

  if (comment) {
    res.status(200).json(comment)
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
