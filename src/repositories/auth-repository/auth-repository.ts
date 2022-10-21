import bcrypt from 'bcrypt';
import {users} from '../db';

interface loginInputModel {
  login: string
  password: string
}

export const authRepository = {
  async login(loginData: loginInputModel) {
    const user = await users.findOne({login: loginData.login})

    if (!user) return false

    return bcrypt.compare(loginData.password, user.password)
  }
}
