import {Post} from '../../utils/interfaces';
import {homework3Posts} from '../db';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';

export const postsRepositoryQuery = {
  async getAllPosts(data: any) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = data

    const totalCount = await homework3Posts.countDocuments()

    const items = await homework3Posts
      .find({})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({sortBy: sortDirection == 'asc' ? 1 : -1})
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
    return homework3Posts.findOne({id})
  }
}
