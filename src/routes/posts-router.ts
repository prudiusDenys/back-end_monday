import {Router} from 'express';
import {authMiddleware} from '../middlewares/authMiddleware';
import {authMiddlewareBearer} from '../middlewares/authMiddlewareBearer';
import {body} from 'express-validator';
import {postsController} from '../composition-root';

export const postsRouter = Router({})

postsRouter.get('/', postsController.getAllPosts.bind(postsController))
postsRouter.get('/:id', postsController.getPost.bind(postsController))
postsRouter.get('/:postId/comments', postsController.findAllCommentsForSpecificPost.bind(postsController))

postsRouter.post('/', authMiddleware, postsController.createPost.bind(postsController))
postsRouter.post(
  '/:postId/comments',
  body('content').isString().trim().isLength({min: 20, max: 300})
    .withMessage({message: 'content is incorrect', field: 'content'}),
  authMiddlewareBearer,
  postsController.createComment.bind(postsController))
postsRouter.put('/:id', authMiddleware, postsController.editPost.bind(postsController))
postsRouter.delete('/:id', authMiddleware, postsController.deletePost.bind(postsController))
