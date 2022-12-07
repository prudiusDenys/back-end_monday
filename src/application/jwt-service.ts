import jwt from 'jsonwebtoken'
import {settings} from '../settings';

export interface VerifiedUserByTokenResponse {
  userId: string
  deviceId: string
  issueAt: string
  expiredDate: string
}

export const jwtService = {
  async createJWTAccessToken(userId: string) {
    const token = jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '1h'})
    return {accessToken: token}

  },
  async createJWTRefreshToken(userId: string, deviceId: string) {
    return jwt.sign({userId, deviceId}, settings.JWT_SECRET_REFRESH, {expiresIn: '1d'})
  },
  async verifyUserByToken(token: string, secretKey: string): Promise<VerifiedUserByTokenResponse | null> {
    try {
      const result: any = await jwt.verify(token, secretKey)
      return {
        userId: result.userId,
        deviceId: result.deviceId,
        issueAt: new Date(result.iat * 1000).toISOString(),
        expiredDate: new Date(result.exp * 1000).toISOString()
      }
    } catch (e) {
      return null
    }
  }
}
