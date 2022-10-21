import {UserViewModel} from '../../services/users-service';
import {users} from '../db';

interface NewUser extends UserViewModel {
  password: string
}

export const usersRepository = {
  async createUser(newUser: NewUser) {
    return users.insertOne(newUser)
  },
  async deleteUser(userId: string) {
    const res = await users.deleteOne({id: userId})
    return res.deletedCount
  }
}
