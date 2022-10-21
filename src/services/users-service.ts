import {usersRepository} from '../repositories/users-repository/users-repository';
import {generateHash} from '../utils/generateHash';

interface UserInputModel {
  login: string
  password: string
  email: string
}

export interface UserViewModel {
  id: string
  login: string
  email: string
  createdAt: string
}

export const usersService = {
  async createUser(userData: UserInputModel): Promise<UserViewModel> {
    const hash = await generateHash(10, userData.password)
    const date = Number(new Date())

    const newUser: UserViewModel = {
      id: date.toString(),
      login: userData.login,
      email: userData.email,
      createdAt: new Date().toISOString()
    }

    await usersRepository.createUser({...newUser, password: hash})

    return newUser
  }
}
