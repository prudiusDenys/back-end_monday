import {AuthDeviceSession, User} from './interfaces';
import {UserViewModel} from '../repositories/users-repository/users-repositoryQuery';

export const removeMongoId = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((item: any) => {
      delete item['_id']
      return item
    })
  } else {
    delete data['_id']
    return data
  }
}

export const normalizeAllBlogsAndPosts = (data: any) => {
  return {
    pagesCount: data.pagesCount,
    page: +data.pageNumber,
    pageSize: +data.pageSize,
    totalCount: data.totalCount,
    items: removeMongoId(data.items)
  }
}

export const removeParentId = (data: any) => {
  delete data.parentId
  return data
}

export const normalizeUserForAuthMe = (user: User) => {
  return {
    email: user.accountData.email,
    login: user.accountData.login,
    userId: user.id
  }
}

export const normalizeUser = (user: User) => {
  return {
    id: user.id,
    email: user.accountData.email,
    login: user.accountData.login,
    createdAt: user.accountData.createdAt
  }
}

export const normalizeAllUsers = (users: UserViewModel) => {
  const items = users.items.map((user: User) => {
    return {
      id: user.id,
      email: user.accountData.email,
      login: user.accountData.login,
      createdAt: user.accountData.createdAt
    }
  })
  return {...users, items}
}

export const normalizeSecurityDevices = (authDevicesSessions: AuthDeviceSession[]) => {
  return authDevicesSessions.map((session: AuthDeviceSession) => {
    return {
      ip: session.ip,
      title: session.title,
      lastActivatedDate: session.lastActivatedDate,
      expiredDate: session.expiredDate,
      deviceId: session.deviceId
    }
  })
}
