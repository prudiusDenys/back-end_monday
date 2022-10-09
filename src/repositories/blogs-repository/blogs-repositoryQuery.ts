import {Blog} from '../../utils/interfaces';
import {homework3Blogs, homework3Posts} from '../db';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';

interface QueryData {
  searchNameTerm: string
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}

export const blogsRepositoryQuery = {
  async getAllBloggers(data: any) {
    const {
      searchNameTerm = null,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10
    } = data

    const totalCount = await homework3Blogs.countDocuments()

    const items = await homework3Blogs
      .find(searchNameTerm ? {'name': {$regex: new RegExp(searchNameTerm, 'i')}} : {})
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
  async geAllPostsOfBlog(data: any, blogId: string) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = data

    const totalCount = await homework3Blogs.countDocuments()

    const items = await homework3Posts
      .find({blogId})
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
  async findBlogger(id: string): Promise<Blog | null> {
    return await homework3Blogs.findOne({id})
  }
}
