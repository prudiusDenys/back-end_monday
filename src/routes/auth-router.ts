import {Request, Response, Router} from 'express';
import {body, cookie, validationResult} from 'express-validator';
import {authRepository} from '../repositories/auth-repository/auth-repository';
import {jwtService} from '../application/jwt-service';
import {authService} from '../services/auth-service';
import {usersRepository} from '../repositories/users-repository/users-repository';
import {authMiddlewareBearer} from '../middlewares/authMiddlewareBearer';
import {normalizeUserForAuthMe} from '../utils/normalizeData';
import {settings} from '../settings';
import {uuid} from 'uuidv4';
import {sessionsService} from '../services/sessions-service';
import {sessionsRepositoryQuery} from '../repositories/sessions-repository/sessions-repositoryQuery';
import {countingRequestsMiddleware} from '../middlewares/countingRequestsMiddleware';
import {usersService} from '../services/users-service';

export const authRouter = Router({})

authRouter.get('/me', authMiddlewareBearer, async (req: Request, res: Response) => {
  const token = req.headers.authorization!.split(' ')[1]
  const {userId}: any = await jwtService.verifyUserByToken(token, settings.JWT_SECRET)
  const currentUser = await usersRepository.findUserById(userId)
  const normalizedCurrentUser = normalizeUserForAuthMe(currentUser!)

  res.status(200).json(normalizedCurrentUser)
})

authRouter.post('/login',
  countingRequestsMiddleware,
  body('loginOrEmail').isString().trim().withMessage({message: 'loginOrEmail is incorrect', field: 'loginOrEmail'}),
  body('password').isString().trim().withMessage({message: 'password is incorrect', field: 'password'}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const user = await authRepository.checkCredentials(req.body)

    if (user) {
      const ip = req.ip
      const title = req.headers['user-agent']
      const deviceId = uuid()

      const token = await jwtService.createJWTAccessToken(user.id)
      const refreshToken = await jwtService.createJWTRefreshToken(user.id, deviceId)

      await sessionsService.addNewSession(user.id, ip, title!, refreshToken, deviceId)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      }).header({
        'Retry-After': 5
      }).status(200).json(token)
    } else {
      res.sendStatus(401)
    }
  })

authRouter.post('/refresh-token',
  cookie('refreshToken').isJWT().withMessage({message: 'refreshToken is incorrect', field: 'refreshToken'}),
  cookie('refreshToken').custom(value => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_REFRESH)
      .then((tokenData) => {
        if (tokenData) {
          return sessionsRepositoryQuery.findSessionByDeviceId(tokenData.deviceId)
            .then(session => {
              if (!session) return true
              if (session.expiredRefreshTokens.includes(value)) {
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

    const {
      userId,
      deviceId
    }: any = await jwtService.verifyUserByToken(req.cookies.refreshToken, settings.JWT_SECRET_REFRESH)

    if (userId) {
      await sessionsService.updateLastActiveDateSession(userId, deviceId)
      await sessionsService.setExpiredToken(userId, deviceId, req.cookies.refreshToken)
      const token = await jwtService.createJWTAccessToken(userId)
      const refreshToken = await jwtService.createJWTRefreshToken(userId, deviceId)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
      }).status(200).json(token)
    } else {
      res.sendStatus(401)
    }
  })

authRouter.post('/logout',
  cookie('refreshToken').isJWT().withMessage({message: 'refreshToken is incorrect', field: 'refreshToken'}),
  cookie('refreshToken').custom((value) => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_REFRESH)
      .then((tokenData) => {
        if (tokenData) {
          return sessionsRepositoryQuery.findSessionByDeviceId(tokenData.deviceId)
            .then(session => {
              if (!session) return true
              if (session.expiredRefreshTokens.includes(value)) {
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

    const {
      userId,
      deviceId
    }: any = await jwtService.verifyUserByToken(req.cookies.refreshToken, settings.JWT_SECRET_REFRESH)

    if (userId) {
      await sessionsService.setExpiredToken(userId, deviceId, req.cookies.refreshToken)
      await sessionsService.removeSession(deviceId)
      // res.clearCookie('refreshToken')
      res.sendStatus(204)
    } else {
      res.sendStatus(401)
    }
  })

authRouter.post('/registration',
  countingRequestsMiddleware,
  body('email').isEmail().trim().withMessage({message: 'email is incorrect', field: 'email'}),
  body('email').custom(value => {
    return usersRepository.findUserByEmail(value).then(user => {
      if (user) {
        return Promise.reject({message: 'E-mail already in use', field: 'email'})
      }
    })
  }),
  body('login').isString().trim().isLength({min: 3, max: 10}).withMessage({
    message: 'login is incorrect',
    field: 'login'
  }),
  body('login').custom(value => {
    return usersRepository.findUserByLogin(value).then(user => {
      if (user) {
        return Promise.reject({message: 'Login already in use', field: 'login'})
      }
    })
  }),
  body('password').isString().trim().isLength({min: 6, max: 20}).withMessage({
    message: 'password is incorrect',
    field: 'password'
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = await authService.createUser(req.body)

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(400)
    }
  })

authRouter.post('/registration-confirmation',
  countingRequestsMiddleware,
  body('code').isString().trim().withMessage({message: 'code is incorrect', field: 'code'}),
  body('code').custom((value, {req}) => {
    return usersRepository.findUserByConfirmationCode(value).then(user => {
      if (!user) return Promise.reject({message: 'User does not exist', field: 'code'})
      if (user.emailConfirmation.isConfirmed) return Promise.reject({message: 'Already confirmed', field: 'code'})
      if (user.emailConfirmation.confirmationCode !== req.body.code) return Promise.reject({
        message: 'Something went wrong',
        field: 'code'
      })
      if (user.emailConfirmation.expirationDate < new Date()) return Promise.reject({
        message: 'Code has been expired',
        field: 'code'
      })
    })
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = await authService.confirmEmail(req.body.code)

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(400)
    }
  })

authRouter.post('/registration-email-resending',
  countingRequestsMiddleware,
  body('email').isEmail().trim().withMessage({message: 'email is incorrect', field: 'email'}),
  body('email').custom((value) => {
    return usersRepository.findUserByEmail(value).then(user => {
      if (!user) return Promise.reject({message: 'User does not exist', field: 'email'})
      if (user.emailConfirmation.isConfirmed) return Promise.reject({
        message: 'Email is already confirmed',
        field: 'email'
      })
    })
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = await authService.resendEmail(req.body.email)

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(400)
    }
  })

authRouter.post('/password-recovery',
  countingRequestsMiddleware,
  body('email').isEmail().trim().withMessage({message: 'email is incorrect', field: 'email'}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    await authService.recoveryPassword(req.body.email)

    res.sendStatus(204)
  })

authRouter.post('/new-password',
  countingRequestsMiddleware,
  body('newPassword').isString().trim().isLength({min: 6, max: 20}).withMessage({
    message: 'newPassword is incorrect',
    field: 'newPassword'
  }),
  body('recoveryCode').custom((value) => {
    return jwtService.verifyUserByToken(value, settings.JWT_SECRET_PASSWORD_RECOVERY)
      .then(tokenData => {
        if (!tokenData) {
          return Promise.reject({message: 'recoveryCode is incorrect', field: 'recoveryCode'})
        }
      })
  }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const result = await jwtService.verifyUserByToken(req.body.recoveryCode, settings.JWT_SECRET_PASSWORD_RECOVERY)

    if (!result) return res.sendStatus(400)

    await usersService.updateUserPassword(result.userId, req.body.newPassword)
    res.sendStatus(204)
  })
