import {PostsRepository} from './repositories/posts-repository/posts-repository';
import {PostsRepositoryQuery} from './repositories/posts-repository/posts-repositoryQuery';
import {PostsService} from './services/posts-service';
import {PostsController} from './controllers/posts-controller';
import {CommentsController} from './controllers/comments-controller';
import {CommentsRepositoryQuery} from './repositories/comments-repository/comments-repositoryQuery';
import {CommentsRepository} from './repositories/comments-repository/comments-repository';
import {LikesRepositoryQuery} from './repositories/likes-repository/likes-repositoryQuery';
import {LikesRepository} from './repositories/likes-repository/likes-repository';
import {RemovingAllController} from './controllers/removingAll-controller';
import {RemovingAllRepository} from './repositories/removingAll-repository';

//Posts composition
const postsRepository = new PostsRepository()
const postsRepositoryQuery = new PostsRepositoryQuery()
const postsService = new PostsService(postsRepository, postsRepositoryQuery)
export const postsController = new PostsController(postsService, postsRepositoryQuery)

//Comments and Likes composition
const commentsRepositoryQuery = new CommentsRepositoryQuery()
const commentsRepository = new CommentsRepository()
const likesRepositoryQuery = new LikesRepositoryQuery()
const likesRepository = new LikesRepository()
export const commentsController = new CommentsController(
  commentsRepositoryQuery,
  commentsRepository,
  likesRepositoryQuery,
  likesRepository
)


// removingAll
const removingAllRepository = new RemovingAllRepository()
export const removingAllController = new RemovingAllController(removingAllRepository)
