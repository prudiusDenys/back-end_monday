import {Post, QueryParams} from '../../utils/interfaces';
import {comments, posts} from '../db';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';

export const postsRepositoryQuery = {
  async getAllPosts(data: QueryParams) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = data

    const totalCount = await posts.countDocuments()

    const items = await posts
      .find({}, {projection: {_id: 0}})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection == 'asc' ? 1 : -1})
      .toArray()

    return {
      pageSize,
      pageNumber,
      totalCount,
      items,
      pagesCount: calcPagesCount(totalCount, +pageSize)
    }
  },
  async findPost(id: string): Promise<Post | null> {
    return posts.findOne({id})
  },
  async findAllCommentsForSpecificPost(data: QueryParams, postId: string) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = data

    const post = await posts.findOne({id: postId})

    if (!post) return null

    const commentsCount = await comments.countDocuments({parentId: postId})

    const items = await comments.find({parentId: postId}, {projection: {_id: 0, parentId: 0}})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
      .toArray()

    return {
      pagesCount: calcPagesCount(commentsCount, +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: commentsCount,
      items
    }
  }
}
