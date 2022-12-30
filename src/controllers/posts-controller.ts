import {PostsService} from '../services/posts-service';
import {PostsRepositoryQuery} from '../repositories/posts-repository/posts-repositoryQuery';
import {Request, Response} from 'express';
import {QueryParams} from '../utils/interfaces';
import {removeMongoId, removeParentId} from '../utils/normalizeData';
import {validationResult} from 'express-validator';

export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected postsRepositoryQuery: PostsRepositoryQuery) {
  }

  async getAllPosts(req: Request<{}, {}, {}, QueryParams>, res: Response) {
    const allPosts = await this.postsRepositoryQuery.getAllPosts(req.query)
    res.status(200).json(allPosts)
  }

  async getPost(req: Request, res: Response) {
    const post = await this.postsRepositoryQuery.findPost(req.params.id)

    if (post) {
      const normalizedPost = removeMongoId(post)
      res.status(200).json(normalizedPost);
    } else {
      res.sendStatus(404);
    }
  }

  async findAllCommentsForSpecificPost(req: Request<{ postId: string }, {}, {}, any>, res: Response) {
    const comments = await this.postsRepositoryQuery.findAllCommentsForSpecificPost(req.query, req.params.postId)

    if (comments) {
      res.status(200).json(comments)
    } else {
      res.sendStatus(404)
    }
  }

  async createPost(req: Request, res: Response) {
    const data: any = await this.postsService.createPost(req.body, req.body.blogId)

    if (data?.value) {
      const normalizedPost = removeMongoId(data.value)
      res.status(201).json(normalizedPost)
    } else if (data?.error) {
      res.status(400).json(data.error)
    } else {
      res.sendStatus(404)
    }
  }

  async createComment(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const comment = await this.postsService.createComment(req.params.postId, req.body.content, req.user)

    if (comment) {
      const normalizedComment = removeParentId(comment)
      res.status(201).json(normalizedComment)
    } else {
      res.sendStatus(404)
    }
  }

  async editPost(req: Request, res: Response) {
    const data: any = await this.postsService.editPost(req.params.id, req.body)

    if (data.status === 'success') {
      res.sendStatus(204)
    }
    if (data.error) {
      res.status(400).json(data.error)
    }
    if (data.status === 'notFound') {
      res.sendStatus(404)
    }
  }

  async deletePost(req: Request, res: Response) {
    const status = await this.postsService.deletePost(req.params.id)

    if (status.status === 'success') {
      res.sendStatus(204)
    }
    if (status.status === 'notFound') {
      res.sendStatus(404)
    }
  }
}
