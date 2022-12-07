import {BlogsQueryParams, QueryParams} from '../../utils/interfaces';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';
import {Blogs, Posts} from '../../mongoose/models';

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

    const allPostsByBlogger = await Posts.find({blogId}).lean()

    const items = await Posts
      .find({blogId})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection == 'asc' ? 1 : -1})
      .lean()

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
