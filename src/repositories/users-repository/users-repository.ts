import {users} from '../db';
import {User} from '../../utils/interfaces';


export const usersRepository = {
  async createUser(newUser: User) {
    return users.insertOne(newUser)
  },
  async deleteUser(userId: string) {
    const res = await users.deleteOne({id: userId})
    return res.deletedCount
  },
  async updateConfirmation(userId: string) {
    const res = await users.updateOne({id: userId}, {$set: {'emailConfirmation.isConfirmed': true}})
    return !!res.matchedCount
  }
}
