import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';
import {User, UsersQueryParams} from '../../utils/interfaces';
import {Users} from '../../mongoose/models';


export interface UserViewModel {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: User[]
}

export const usersRepositoryQuery = {
  async getAllUsers(queryData: UsersQueryParams): Promise<UserViewModel> {
    const {
      searchLoginTerm = null,
      searchEmailTerm = null,
      pageNumber = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortDirection = 'desc'
    } = queryData

    let items
    let totalCounts = await Users.countDocuments()

    items = await Users.find({})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
      .lean()
      .select('-__v -_id -password')

    if (searchLoginTerm && searchEmailTerm) {
      const matchedUsers = await Users.find({
        $or: [
          {'login': {$regex: new RegExp(searchLoginTerm, 'i')}},
          {'email': {$regex: new RegExp(searchEmailTerm, 'i')}}
        ]
      }).lean().select('-__v -_id')

      items = await Users.find({
        $or: [
          {'login': {$regex: new RegExp(searchLoginTerm, 'i')}},
          {'email': {$regex: new RegExp(searchEmailTerm, 'i')}}
        ]
      })
        .skip(calcSkipPages(+pageNumber, +pageSize))
        .limit(+pageSize)
        .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        .lean()
        .select('-__v -_id -password')

      totalCounts = matchedUsers.length
    }

    if (searchLoginTerm && !searchEmailTerm) {
      const matchedUsers = await Users.find({'login': {$regex: new RegExp(searchLoginTerm, 'i')}}).lean().select('-__v -_id')

      items = await Users.find({'login': {$regex: new RegExp(searchLoginTerm, 'i')}})
        .skip(calcSkipPages(+pageNumber, +pageSize))
        .limit(+pageSize)
        .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        .lean()
        .select('-__v -_id -password')

      totalCounts = matchedUsers.length
    }

    if (searchEmailTerm && !searchLoginTerm) {
      const matchedUsers = await Users.find({'email': {$regex: new RegExp(searchEmailTerm, 'i')}}).lean().select('-__v -_id')

      items = await Users.find({'email': {$regex: new RegExp(searchEmailTerm, 'i')}})
        .skip(calcSkipPages(+pageNumber, +pageSize))
        .limit(+pageSize)
        .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        .lean()
        .select('-__v -_id -password')

      totalCounts = matchedUsers.length
    }

    return {
      pagesCount: calcPagesCount(totalCounts, +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCounts,
      items
    }
  }
}
