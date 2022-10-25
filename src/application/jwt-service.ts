import jwt from 'jsonwebtoken'
import {User} from '../utils/interfaces';
import {settings} from '../settings';

export const jwtService = {
  async createJWT(user: User) {
    const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '30d'})
    return {accessToken: token}

  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = await jwt.verify(token, settings.JWT_SECRET)
      return result.userId
    } catch (e) {
      return null
    }
  }
}
