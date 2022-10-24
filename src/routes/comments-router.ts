import {Response, Request, Router} from 'express';
import {commentsRepositoryQuery} from '../repositories/comments-repository/comments-repositoryQuery';
import {commentsRepository} from '../repositories/comments-repository/comments-repository';
import {authMiddleware} from '../middlewares/authMiddleware';
import {body, validationResult} from 'express-validator';


export const commentsRouter = Router({})

commentsRouter.get('/:commentId', async (req: Request, res: Response) => {
  const comment = await commentsRepositoryQuery.findComment(req.params.commentId)

  if (comment) {
    res.status(200).json(comment)
  } else {
    res.sendStatus(404)
  }
})

commentsRouter.put('/:commentId', authMiddleware,
  body('content').isString().trim().isLength({min: 20, max: 300})
    .withMessage({message: 'content is incorrect', field: 'content'}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const matchedCount = await commentsRepository.updateComment(req.params.commentId, req.body.content)

    if (matchedCount) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  })

commentsRouter.delete('/:commentId', authMiddleware, async (req: Request, res: Response) => {
  const deletedCount = await commentsRepository.deleteComment(req.params.commentId)

  if (deletedCount) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})
