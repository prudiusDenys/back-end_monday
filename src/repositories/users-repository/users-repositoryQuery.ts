import {users} from '../db';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';
import {UsersQueryParams} from '../../utils/interfaces';

export const usersRepositoryQuery = {
  async getAllUsers(queryData: UsersQueryParams) {
    const {
      searchLoginTerm = null,
      searchEmailTerm = null,
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc'
    } = queryData

    const allUsers = await users.find((searchLoginTerm || searchEmailTerm) ?
      {
        $or: [
          {'login': {$regex: new RegExp(queryData.searchLoginTerm, 'i')}},
          {'email': {$regex: new RegExp(queryData.searchEmailTerm, 'i')}}
        ]
      }
      : {}
    ).toArray()

    const items = await users.find(
      {
        $or: [
          {'login': {$regex: new RegExp(queryData.searchLoginTerm, 'i')}},
          {'email': {$regex: new RegExp(queryData.searchEmailTerm, 'i')}}
        ]
      }
    )
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection === 'desc' ? 1 : -1})
      .toArray()


    return {
      pagesCount: calcPagesCount(allUsers.length, +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: allUsers.length,
      items
    }
  }
}
