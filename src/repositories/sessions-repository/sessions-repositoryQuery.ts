import {authDevicesSessions} from '../db';


export const sessionsRepositoryQuery = {
  async findAllSessions(userId: string) {
    return authDevicesSessions.find({userId}, {projection: {_id: 0, userId: 0, expiredDate: 0, expiredRefreshTokens: 0}}).toArray()
  },
  async findSessionByDeviceId(deviceId: string) {
    return authDevicesSessions.findOne({deviceId})
  }
}
