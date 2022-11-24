import {Request, Response, Router} from 'express';
import {cookie, validationResult} from 'express-validator';
import {jwtService} from '../application/jwt-service';
import {settings} from '../settings';
import {sessionsService} from '../services/sessions-service';
import {sessionsRepositoryQuery} from '../repositories/sessions-repository/sessions-repositoryQuery';


export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices',
  cookie('refreshToken').isJWT().withMessage({message: 'refreshToken is incorrect', field: 'refreshToken'}),
  cookie('refreshToken').custom(value => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_REFRESH)
      .then((tokenData) => {
        if (tokenData) {
          return sessionsRepositoryQuery.findSessionByDeviceId(tokenData.deviceId)
            .then(session => {
              if (!session) return true
              if (session.lastActiveDate !== tokenData.issueAt) {
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

    const allSessions = await sessionsRepositoryQuery.findAllSessions(userId)

    return res.status(200).json(allSessions)
  })

securityDevicesRouter.delete('/devices',
  cookie('refreshToken').isJWT().withMessage({message: 'refreshToken is incorrect', field: 'refreshToken'}),
  cookie('refreshToken').custom(value => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_REFRESH)
      .then((tokenData) => {
        if (tokenData) {
          return sessionsRepositoryQuery.findSessionByDeviceId(tokenData.deviceId)
            .then(session => {
              if (!session) return true
              if (session.lastActiveDate !== tokenData.issueAt) {
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

    const {userId, deviceId}: any = await jwtService.verifyUserByToken(req.cookies.refreshToken, settings.JWT_SECRET_REFRESH)

    await sessionsService.removeAllSessions(userId, deviceId)

    res.sendStatus(204)
  })

securityDevicesRouter.delete('/devices/:deviceId',
  cookie('refreshToken').isJWT().withMessage({message: 'refreshToken is incorrect', field: 'refreshToken'}),
  cookie('refreshToken').custom(value => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_REFRESH)
      .then((tokenData) => {
        if (tokenData) {
          return sessionsRepositoryQuery.findSessionByDeviceId(tokenData.deviceId)
            .then(session => {
              if (!session) return true
              if (session.lastActiveDate !== tokenData.issueAt) {
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

    const session = await sessionsRepositoryQuery.findSessionByDeviceId(req.params.deviceId)

    if (!session) return res.sendStatus(404)
    if (session.userId !== userId) return res.sendStatus(403)

    await sessionsService.removeSession(req.params.deviceId)

    return res.sendStatus(204)
  })
