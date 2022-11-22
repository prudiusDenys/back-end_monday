import {authDevicesSessions} from '../db';
import {AuthDeviceSession} from '../../utils/interfaces';

export const sessionsRepository = {
  async setNewSession(newSession: AuthDeviceSession) {
    await authDevicesSessions.insertOne(newSession)
  },
  async removeAllSessions(userId: string, deviceId: string) {
    await authDevicesSessions.deleteMany({userId, deviceId: {$nin: [deviceId]}})
  },
  async removeSession(deviceId: string) {
    await authDevicesSessions.deleteOne({deviceId})
  }
}
