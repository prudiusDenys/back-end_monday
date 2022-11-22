import {jwtService} from '../application/jwt-service';
import {settings} from '../settings';
import {sessionsRepository} from '../repositories/sessions-repository/sessions-repository';
import {AuthDeviceSession} from '../utils/interfaces';


export const sessionsService = {
  async addNewSession(userId: string, ip: string, title: string, refreshToken: string, deviceId: string) {
    const {issueAt, expiredDate}: any = await jwtService.verifyUserByToken(refreshToken, settings.JWT_SECRET_REFRESH)

    const newSession: AuthDeviceSession = {
      ip,
      title,
      deviceId,
      userId,
      lastActivatedDate: issueAt,
      expiredDate
    }

    await sessionsRepository.setNewSession(newSession)
  },
  async removeAllSessions(userId: string, deviceId: string) {
    await sessionsRepository.removeAllSessions(userId, deviceId)
  },
  async removeSession(deviceId: string) {
    return sessionsRepository.removeSession(deviceId)
  }
}
