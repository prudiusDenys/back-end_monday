import {usersRepository} from '../repositories/users-repository/users-repository';
import {generateHash} from '../utils/generateHash';
import {User} from '../utils/interfaces';
import {uuid} from 'uuidv4';
import add from 'date-fns/add';
import {jwtService} from '../application/jwt-service';
import {settings} from '../settings';

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
      },
      authDevicesSessions: []
    }

    await usersRepository.createUser({...newUser})

    return newUser
  },
  async addDeviceSession(userId: string, ip: string, title: string, refreshToken: string, deviceId: string) {
    const {issueAt, expiredDate}: any = await jwtService.verifyUserByToken(refreshToken, settings.JWT_SECRET_REFRESH)

    await usersRepository.setNewSession(userId, ip, title, issueAt, expiredDate, deviceId)
  },
  async removeAllSessions(userId: string) {
    await usersRepository.removeAllSessions(userId)
  },
  async removeSession(userId: string, deviceId: string) {
    return usersRepository.removeSession(userId, deviceId)
  }
}
