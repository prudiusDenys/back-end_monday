import jwt from 'jsonwebtoken'
import {User} from '../utils/interfaces';
import {settings} from '../settings';
import {ObjectId} from 'mongodb';

export const jwtService = {
  async createJWT(user: User) {
    return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '30d'})
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
