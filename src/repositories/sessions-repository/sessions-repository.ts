import {authDevicesSessions} from '../db';
import {AuthDeviceSession} from '../../utils/interfaces';

export const sessionsRepository = {
  async setNewSession(newSession: AuthDeviceSession) {
    await authDevicesSessions.insertOne(newSession)
  },
  async updateLastActiveDateSession(userId: string, deviceId: string, issueAt: string) {
    await authDevicesSessions.updateOne({userId, deviceId}, {$set: {lastActiveDate: issueAt}})
  },
  async removeAllSessions(userId: string, deviceId: string) {
    await authDevicesSessions.deleteMany({userId, deviceId: {$nin: [deviceId]}})
  },
  async removeSession(deviceId: string) {
    await authDevicesSessions.deleteOne({deviceId})
  },
  async setExpiredToken(userId: string, deviceId: string, token: string) {
    const res = await authDevicesSessions.updateOne({userId, deviceId}, {$push: {expiredRefreshTokens: token}})
    return !!res.matchedCount
  }
}
