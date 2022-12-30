import {Router} from 'express';
import {body} from 'express-validator';
import {authMiddlewareBearer} from '../middlewares/authMiddlewareBearer';
import {commentsController} from '../composition-root';

export const commentsRouter = Router({})

commentsRouter.get('/:id', commentsController.getComment.bind(commentsController))

commentsRouter.put(
  '/:commentId',
  authMiddlewareBearer,
  body('content').isString().trim().isLength({min: 20, max: 300})
    .withMessage({message: 'content is incorrect', field: 'content'}),
  commentsController.updateComment.bind(commentsController)
)

commentsRouter.put(
  '/:commentId/like-status',
  authMiddlewareBearer,
  body('likeStatus').custom((value) => {
    const validValues = ['None', 'Like', 'Dislike']

    if (!validValues.includes(value)) {
      return Promise.reject({message: 'likeStatus is incorrect', field: 'likeStatus'})
    } else {
      return true
    }
  }),
  commentsController.updateLikeStatus.bind(commentsController)
)

commentsRouter.delete('/:commentId', authMiddlewareBearer, commentsController.deleteComment.bind(commentsController))
