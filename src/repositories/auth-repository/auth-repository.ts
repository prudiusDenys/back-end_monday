import bcrypt from 'bcrypt';
import {User} from '../../utils/interfaces';
import {Users} from '../../mongoose/models';

interface loginInputModel {
  loginOrEmail: string
  password: string
}

export const authRepository = {
  async checkCredentials(loginData: loginInputModel): Promise<User | null> {
    const user = await Users.findOne({'accountData.login': loginData.loginOrEmail}).select('-__v -_id')

    if (!user) return null

    const matched = await bcrypt.compare(loginData.password, user.accountData.password)

    if (matched) return user

    return null
  }
}
