import {users} from '../db';
import {User} from '../../utils/interfaces';
import {uuid} from 'uuidv4';


export const usersRepository = {
  async findUserByEmail(email: string) {
    return users.findOne({'accountData.email': email})
  },
  async findUserById(id: string) {
    return users.findOne({id})
  },
  async findUserByConfirmationCode(code: string) {
    return users.findOne({'emailConfirmation.confirmationCode': code})
  },
  async findUserByLogin(login: string) {
    return users.findOne({'accountData.login': login})
  },
  async createUser(newUser: User) {
    return users.insertOne(newUser)
  },
  async updateConfirmation(userId: string) {
    const res = await users.updateOne({id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
    return !!res.matchedCount
  },
  async updateConfirmationCode(id: string, newConfirmationCode: string) {
    const res = await users.findOneAndUpdate(
      {id},
      {$set: {'emailConfirmation.confirmationCode': newConfirmationCode}},
      {returnDocument: 'after'}
    )
    return res.value
  },
  async deleteUser(userId: string) {
    const res = await users.deleteOne({id: userId})
    return res.deletedCount
  },
  async setExpiredToken(userId: string, token: string) {
    const res = await users.updateOne({id: userId}, {$push: {expiredTokens: token}})
    return !!res.matchedCount
  },
  async setNewSession(userId: string, ip: string, title: string, issueAt: string, expiredDate: string, deviceId: string) {
    await users.updateOne({id: userId},
      {
        $push: {
          authDevicesSessions: {
            ip,
            title,
            deviceId,
            lastActivatedDate: issueAt,
            expiredDate: expiredDate,
            userId
          }
        }
      })
  },
  async removeAllSessions(userId: string) {
    await users.updateOne({id: userId}, {$set: {authDevicesSessions: []}})
  },
  async removeSession(userId: string, deviceId: string) {
    const res = await users.updateOne({id: userId}, {$pull: {authDevicesSessions: {deviceId}}})
    return !!res.matchedCount
  }
}
