import {Post, QueryParams} from '../../utils/interfaces';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';
import {Comments, Posts} from '../../mongoose/models';

export const postsRepositoryQuery = {
  async getAllPosts(data: QueryParams) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = data

    const totalCount = await Posts.countDocuments()

    const items = await Posts
      .find({})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection == 'asc' ? 1 : -1})
      .select('-_id -__v')
      .lean()

    return {
      pageSize,
      pageNumber,
      totalCount,
      items,
      pagesCount: calcPagesCount(totalCount, +pageSize)
    }
  },
  async findPost(id: string): Promise<Post | null> {
    return Posts.findOne({id}).select('-__v -_id')
  },
  async findAllCommentsForSpecificPost(data: QueryParams, postId: string) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = data

    const post = await Posts.findOne({id: postId})

    if (!post) return null

    const commentsCount = await Comments.countDocuments({parentId: postId})

    const items = await Comments.find({parentId: postId})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
      .lean()
      .select('-__v -_id -parentId')

    return {
      pagesCount: calcPagesCount(commentsCount, +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: commentsCount,
      items
    }
  }
}
