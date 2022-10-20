import {UserViewModel} from '../../services/users-service';
import {users} from '../db';


export const usersRepository = {
  async createUser(newUser: UserViewModel) {
    return users.insertOne(newUser)
  }
}
