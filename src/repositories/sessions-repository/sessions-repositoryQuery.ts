import {AuthDevicesSessions} from '../../mongoose/models';

export const sessionsRepositoryQuery = {
  async findAllSessions(userId: string) {
    return AuthDevicesSessions.find({userId}).lean().select('-__v -_id -userId -expiredDate -expiredRefreshTokens')
  },
  async findSessionByDeviceId(deviceId: string) {
    return AuthDevicesSessions.findOne({deviceId}).select('-__v -_id')
  }
}
