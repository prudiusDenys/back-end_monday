import {Request, Response} from 'express';
import {
  CommentsRepositoryQuery,
} from '../repositories/comments-repository/comments-repositoryQuery';
import {jwtService} from '../application/jwt-service';
import {settings} from '../settings';
import {validationResult} from 'express-validator';
import {LikesRepositoryQuery} from '../repositories/likes-repository/likes-repositoryQuery';
import {CommentsRepository} from '../repositories/comments-repository/comments-repository';
import {LikesRepository} from '../repositories/likes-repository/likes-repository';

export class CommentsController {
  constructor(
    protected commentsRepositoryQuery: CommentsRepositoryQuery,
    protected commentsRepository: CommentsRepository,
    protected likesRepositoryQuery: LikesRepositoryQuery,
    protected likesRepository: LikesRepository,
  ) {
  }

  async getComment(req: Request, res: Response) {
    const comment = await this.commentsRepositoryQuery.findComment(req.params.id)
    const likesCount = await this.likesRepositoryQuery.getLikesCount(req.params.id)
    const dislikesCount = await this.likesRepositoryQuery.getDislikesCount(req.params.id)

    let myStatus = 'None'

    const result = await jwtService.verifyUserByToken(req.cookies.refreshToken, settings.JWT_SECRET_REFRESH)

    if (result) {
      myStatus = await this.likesRepositoryQuery.getMyStatus(req.params.id, result.userId)
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
  }

  async updateComment(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = await this.commentsRepository.updateComment(req.params.commentId, req.body.content, req.user)

    if (result.status === 204) {
      res.sendStatus(204)
    } else if (result.status === 403) {
      res.sendStatus(403)
    } else {
      res.sendStatus(404)
    }
  }

  async updateLikeStatus(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = await this.likesRepository.updateLikeStatus(req.user.id, req.params.commentId, req.body.likeStatus)

    if (result) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)
    }
  }

  async deleteComment(req: Request, res: Response) {
    const result = await this.commentsRepository.deleteComment(req.params.commentId, req.user)

    if (result.status === 204) {
      res.sendStatus(204)
    } else if (result.status === 403) {
      res.sendStatus(403)
    } else {
      res.sendStatus(404)
    }
  }
}
