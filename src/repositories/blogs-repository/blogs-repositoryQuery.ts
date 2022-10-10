import {Blog, QueryParams} from '../../utils/interfaces';
import {homework3Blogs, homework3Posts} from '../db';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';

export const blogsRepositoryQuery = {
  async getAllBloggers(data: QueryParams) {
    const {
      sortDirection = 'desc',
      sortBy = 'createdAt',
      pageNumber = 1,
      pageSize = 10
    } = data

    const allBlogs = await homework3Blogs
      .find(data.searchNameTerm ? {'name': {$regex: new RegExp(data.searchNameTerm, 'i')}} : {}).toArray()

    const items = await homework3Blogs
      .find(data.searchNameTerm ? {'name': {$regex: new RegExp(data.searchNameTerm, 'i')}} : {})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection == 'asc' ? 1 : -1})
      .toArray()

    return {
      pageSize: pageSize,
      pageNumber,
      totalCount: allBlogs.length,
      items,
      pagesCount: calcPagesCount(allBlogs.length, +pageSize)
    }
  },
  async geAllPostsOfBlog(data: QueryParams, blogId: string) {
    const {
      sortBy = 'createdAt',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = data

    const allPostsByBlogger = await homework3Posts.find({blogId}).toArray()

    const items = await homework3Posts
      .find({blogId})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection == 'asc' ? 1 : -1})
      .toArray()

    return {
      pageSize,
      pageNumber,
      totalCount: allPostsByBlogger.length,
      items,
      pagesCount: calcPagesCount(allPostsByBlogger.length, +pageSize)
    }
  },
  async findBlogger(id: string): Promise<Blog | null> {
    return await homework3Blogs.findOne({id})
  }
}
