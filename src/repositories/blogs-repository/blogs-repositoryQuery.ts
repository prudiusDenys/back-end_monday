import {Blog, BlogsQueryParams, QueryParams} from '../../utils/interfaces';
import {Blogs, posts} from '../db';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';

export const blogsRepositoryQuery = {
  async getAllBloggers(data: BlogsQueryParams) {
    const {
      sortDirection = 'desc',
      sortBy = 'createdAt',
      pageNumber = 1,
      pageSize = 10
    } = data

    const allBlogs = await Blogs
      .find(data.searchNameTerm ? {'name': {$regex: new RegExp(data.searchNameTerm, 'i')}} : {}).lean()

    const items = await Blogs
      .find(data.searchNameTerm ? {'name': {$regex: new RegExp(data.searchNameTerm, 'i')}} : {})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection == 'asc' ? 1 : -1})
      .select('-__v -_id')
      .lean()

    return {
      pageSize,
      pageNumber,
      items,
      totalCount: allBlogs.length,
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

    const allPostsByBlogger = await posts.find({blogId}).toArray()

    const items = await posts
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
  async findBlogger(id: string): Promise<any> {
    return Blogs.findOne({id}).select('-__v -_id')
  }
}
