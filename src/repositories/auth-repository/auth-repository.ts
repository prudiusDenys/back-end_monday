import bcrypt from 'bcrypt';
import {users} from '../db';
import {User} from '../../utils/interfaces';

interface loginInputModel {
  loginOrEmail: string
  password: string
}

export const authRepository = {
  async checkCredentials(loginData: loginInputModel): Promise<User | null> {
    const user = await users.findOne({'accountData.login': loginData.loginOrEmail})

    if (!user) return null

    const matched = await bcrypt.compare(loginData.password, user.accountData.password)

    if (matched) return user

    return null
  }
}
