import {users} from '../db';
import {User} from '../../utils/interfaces';


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
  }
}
