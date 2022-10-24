import bcrypt from 'bcrypt';
import {users} from '../db';
import {User} from '../../utils/interfaces';

interface loginInputModel {
  login: string
  password: string
}

export const authRepository = {
  async checkCredentials(loginData: loginInputModel): Promise<User | boolean> {
    const user = await users.findOne({login: loginData.login})

    if (!user) return false

    const matched = await bcrypt.compare(loginData.password, user.password)

    if (matched) return user

    return false
  }
}
