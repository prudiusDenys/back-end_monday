import {uuid} from 'uuidv4';
import add from 'date-fns/add';
import {generateHash} from '../utils/generateHash';
import {usersRepository} from '../repositories/users-repository/users-repository';
import {emailsManager} from '../managers/emails-manager';
import {users} from '../repositories/db';
import {User} from '../utils/interfaces';

interface RegistrationInputModel {
  email: string
  login: string
  password: string
}

export const authService = {
  async createUser(registrationData: RegistrationInputModel): Promise<boolean> {
    const hash = await generateHash(10, registrationData.password)

    const newUser: User = {
      id: uuid(),
      accountData: {
        login: registrationData.login,
        email: registrationData.email,
        password: hash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuid(),
        expirationDate: add(new Date(), {days: 3}),
        isConfirmed: false
      }
    }

    await usersRepository.createUser(newUser)

    try {
      await emailsManager.sendEmailConfirmationMessage(newUser)
      return true
    } catch (e) {
      console.log(e)
      await usersRepository.deleteUser(newUser.id)
      return false
    }
  },
  async confirmEmail(confirmationCode: string): Promise<boolean> {
    const user = await users.findOne({'emailConfirmation.confirmationCode': confirmationCode})

    if (!user) return false

    if (user.emailConfirmation.expirationDate > new Date()) {
      return await usersRepository.updateConfirmation(user.id)
    }
    return false
  }
}
