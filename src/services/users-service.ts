import {usersRepository} from '../repositories/users-repository/users-repository';
import {generateHash} from '../utils/generateHash';
import {User} from '../utils/interfaces';
import {uuid} from 'uuidv4';
import add from 'date-fns/add';

interface UserInputModel {
  login: string
  password: string
  email: string
}

export const usersService = {
  async createUser(userData: UserInputModel): Promise<User> {
    const hash = await generateHash(10, userData.password)

    const newUser: User = {
      id: uuid(),
      accountData: {
        login: userData.login,
        email: userData.email,
        createdAt: new Date().toISOString(),
        password: hash
      },
      emailConfirmation: {
        confirmationCode: uuid(),
        expirationDate: add(new Date(), {days: 3}),
        isConfirmed: false
      }
    }

    await usersRepository.createUser({...newUser})

    return newUser
  },
  async updateUserPassword(userId: string, newPassword: string) {
    const hash = await generateHash(10, newPassword)
    await usersRepository.updatePassword(userId, hash)
  }
}
