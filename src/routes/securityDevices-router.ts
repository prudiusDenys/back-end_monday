import {Request, Response, Router} from 'express';
import {cookie, validationResult} from 'express-validator';
import {jwtService} from '../application/jwt-service';
import {settings} from '../settings';
import {usersRepository} from '../repositories/users-repository/users-repository';
import {normalizeSecurityDevices} from '../utils/normalizeData';
import {usersService} from '../services/users-service';


export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices',
  cookie('refreshToken').isJWT().withMessage({message: 'refreshToken is incorrect', field: 'refreshToken'}),
  cookie('refreshToken').custom(value => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_REFRESH)
      .then((tokenData) => {
        if (tokenData) {
          return usersRepository.findUserById(tokenData.userId)
            .then(user => {
              const activeSession = user!.authDevicesSessions.find(session => session.deviceId === tokenData.deviceId)
              if (!activeSession) return true
              if (activeSession.lastActivatedDate !== tokenData.issueAt) {
                return Promise.reject({message: 'refreshToken is incorrect', field: 'refreshToken'})
              }
            })
        } else {
          return Promise.reject({message: 'refreshToken is incorrect', field: 'refreshToken'})
        }
      })
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(401).json({errorsMessages})
    }

    const {userId}: any = await jwtService.verifyUserByToken(req.cookies.refreshToken, settings.JWT_SECRET_REFRESH)

    const user = await usersRepository.findUserById(userId)

    const normalizedSecurityDevicesSessions = normalizeSecurityDevices(user!.authDevicesSessions)


    return res.status(200).json(normalizedSecurityDevicesSessions)

  })

securityDevicesRouter.delete('/devices',
  cookie('refreshToken').isJWT().withMessage({message: 'refreshToken is incorrect', field: 'refreshToken'}),
  cookie('refreshToken').custom(value => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_REFRESH)
      .then((tokenData) => {
        if (tokenData) {
          return usersRepository.findUserById(tokenData.userId)
            .then(user => {
              const activeSession = user!.authDevicesSessions.find(session => session.deviceId === tokenData.deviceId)
              if (!activeSession) return true
              if (activeSession.lastActivatedDate !== tokenData.issueAt) {
                return Promise.reject({message: 'refreshToken is incorrect', field: 'refreshToken'})
              }
            })
        } else {
          return Promise.reject({message: 'refreshToken is incorrect', field: 'refreshToken'})
        }
      })
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(401).json({errorsMessages})
    }

    const {userId}: any = await jwtService.verifyUserByToken(req.cookies.refreshToken, settings.JWT_SECRET_REFRESH)

    await usersService.removeAllSessions(userId)

    res.sendStatus(204)

  })

securityDevicesRouter.delete('/devices/:deviceId',
  cookie('refreshToken').isJWT().withMessage({message: 'refreshToken is incorrect', field: 'refreshToken'}),
  cookie('refreshToken').custom(value => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_REFRESH)
      .then((tokenData) => {
        if (tokenData) {
          return usersRepository.findUserById(tokenData.userId)
            .then(user => {
              const activeSession = user!.authDevicesSessions.find(session => session.deviceId === tokenData.deviceId)
              if (!activeSession) return true
              if (activeSession.lastActivatedDate !== tokenData.issueAt) {
                return Promise.reject({message: 'refreshToken is incorrect', field: 'refreshToken'})
              }
            })
        } else {
          return Promise.reject({message: 'refreshToken is incorrect', field: 'refreshToken'})
        }
      })
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(401).json({errorsMessages})
    }

    const {userId}: any = await jwtService.verifyUserByToken(req.cookies.refreshToken, settings.JWT_SECRET_REFRESH)

    const deletedSession = await usersService.removeSession(userId, req.params.deviceId)

    if (deletedSession) {
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)
    }
  })
