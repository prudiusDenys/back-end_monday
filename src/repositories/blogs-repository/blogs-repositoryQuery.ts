import {Blog} from '../../utils/interfaces';
import {homework3Blogs, homework3Posts} from '../db';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';

export interface QueryData {
  searchNameTerm: string
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
}

export const blogsRepositoryQuery = {
  async getAllBloggers(data: QueryData) {
    const params = {
      sortBy: 'createdAt',
      sortDirection: 'desc',
      ...data
    }

    const items = await homework3Blogs
      .find(params.searchNameTerm ? {'name': {$regex: new RegExp(params.searchNameTerm, 'i')}} : {})
      .skip(calcSkipPages(+params.page, +params.pageSize))
      .limit(+params.pageSize)
      .sort({[params.sortBy]: params.sortDirection == 'asc' ? 1 : -1})
      .toArray()

    return {
      pageSize: params.pageSize,
      pageNumber: params.page,
      totalCount: items.length,
      items,
      pagesCount: calcPagesCount(items.length, +params.pageSize)
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
