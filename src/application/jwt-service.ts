import jwt from 'jsonwebtoken'
import {settings} from '../settings';

export const jwtService = {
  async createJWTAccessToken(userId: string) {
    const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: 10})
    return {accessToken: token}

  },
  async createJWTRefreshToken(userId: string) {
    return  jwt.sign({userId}, settings.JWT_SECRET_REFRESH, {expiresIn: 20})
  },
  async verifyUserByToken(token: string, secretKey: string) {
    try {
      const result: any = await jwt.verify(token, secretKey)
      return result.userId
    } catch (e) {
      return null
    }
  }
}
