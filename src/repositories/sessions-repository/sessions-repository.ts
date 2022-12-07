import {AuthDeviceSession} from '../../utils/interfaces';
import {AuthDevicesSessions} from '../../mongoose/models';

export const sessionsRepository = {
  async setNewSession(newSession: AuthDeviceSession) {
    await AuthDevicesSessions.create(newSession)
  },
  async updateLastActiveDateSession(userId: string, deviceId: string, issueAt: string) {
    await AuthDevicesSessions.updateOne({userId, deviceId}, {$set: {lastActiveDate: issueAt}})
  },
  async removeAllSessions(userId: string, deviceId: string) {
    await AuthDevicesSessions.deleteMany({userId, deviceId: {$nin: [deviceId]}})
  },
  async removeSession(deviceId: string) {
    await AuthDevicesSessions.deleteOne({deviceId})
  },
  async setExpiredToken(userId: string, deviceId: string, token: string) {
    const res = await AuthDevicesSessions.updateOne({userId, deviceId}, {$push: {expiredRefreshTokens: token}})
    return !!res.matchedCount
  }
}
