import {users} from '../db';
import {calcPagesCount, calcSkipPages} from '../../utils/calculatePagination';
import {UsersQueryParams} from '../../utils/interfaces';

interface Item {
  id: string
  login: string
  email: string
  createdAt: string
}

interface UserViewModel {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: Item[]
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
    let totalCounts = await users.countDocuments()

    items = await users.find({})
      .project({_id: 0, password: 0})
      .skip(calcSkipPages(+pageNumber, +pageSize))
      .limit(+pageSize)
      .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
      .toArray() as Item[]

    if (searchLoginTerm && searchEmailTerm) {
      const matchedUsers = await users.find({
        $or: [
          {'login': {$regex: new RegExp(searchLoginTerm, 'i')}},
          {'email': {$regex: new RegExp(searchEmailTerm, 'i')}}
        ]
      }).toArray()

      items = await users.find({
        $or: [
          {'login': {$regex: new RegExp(searchLoginTerm, 'i')}},
          {'email': {$regex: new RegExp(searchEmailTerm, 'i')}}
        ]
      })
        .project({_id: 0, password: 0})
        .skip(calcSkipPages(+pageNumber, +pageSize))
        .limit(+pageSize)
        .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        .toArray() as Item[]

      totalCounts = matchedUsers.length
    }

    if (searchLoginTerm && !searchEmailTerm) {
      const matchedUsers = await users.find({'login': {$regex: new RegExp(searchLoginTerm, 'i')}}).toArray()

      items = await users.find({'login': {$regex: new RegExp(searchLoginTerm, 'i')}})
        .project({_id: 0, password: 0})
        .skip(calcSkipPages(+pageNumber, +pageSize))
        .limit(+pageSize)
        .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        .toArray() as Item[]

      totalCounts = matchedUsers.length
    }

    if (searchEmailTerm && !searchLoginTerm) {
      const matchedUsers = await users.find({'email': {$regex: new RegExp(searchEmailTerm, 'i')}}).toArray()

        items = await users.find({'email': {$regex: new RegExp(searchEmailTerm, 'i')}})
        .project({_id: 0, password: 0})
        .skip(calcSkipPages(+pageNumber, +pageSize))
        .limit(+pageSize)
        .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        .toArray() as Item[]

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
