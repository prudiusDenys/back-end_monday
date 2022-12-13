import {uuid} from 'uuidv4';
import add from 'date-fns/add';
import {generateHash} from '../utils/generateHash';
import {usersRepository} from '../repositories/users-repository/users-repository';
import {emailsManager} from '../managers/emails-manager';
import {User} from '../utils/interfaces';
import {jwtService} from '../application/jwt-service';

export interface RegistrationInputModel {
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
      },
    }

    await usersRepository.createUser(newUser)

    try {
      await emailsManager.sendEmailConfirmationMessage(newUser)
      return true
    } catch (e) {
      console.error(e)
      await usersRepository.deleteUser(newUser.id)
      return false
    }
  },
  async confirmEmail(confirmationCode: string): Promise<boolean> {
    const user = await usersRepository.findUserByConfirmationCode(confirmationCode)

    return await usersRepository.updateConfirmation(user!.id)
  },
  async resendEmail(email: string) {
    const user = await usersRepository.findUserByEmail(email)
    const newConfirmationCode = uuid()
    const updatedUser = await usersRepository.updateConfirmationCode(user!.id, newConfirmationCode)

    try {
      await emailsManager.sendEmailConfirmationMessage(updatedUser!)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  },
  async recoveryPassword(email: string) {
    const user = await usersRepository.findUserByEmail(email)
    if(!user) return

    const passwordRecoveryToken = await jwtService.createJWTPasswordRecoveryToken(user.id)

    await emailsManager.sendPasswordRecoveryEmail(email, passwordRecoveryToken)
  }
}
