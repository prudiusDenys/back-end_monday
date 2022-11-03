import {Request, Response, Router} from 'express';
import {body, validationResult} from 'express-validator';
import {authRepository} from '../repositories/auth-repository/auth-repository';
import {jwtService} from '../application/jwt-service';
import {authService} from '../services/auth-service';
import {emailsManager} from '../managers/emails-manager';
import {usersRepository} from '../repositories/users-repository/users-repository';
import {authMiddlewareBearer} from '../middlewares/authMiddlewareBearer';
import {normalizeUserForAuthMe} from '../utils/normalizeData';

export const authRouter = Router({})

authRouter.get('/me', authMiddlewareBearer, async (req: Request, res: Response) => {
  const token = req.headers.authorization!.split(' ')[1]
  const userId = await jwtService.getUserIdByToken(token)
  const currentUser = await usersRepository.findUserById(userId)
  const normalizedCurrentUser = normalizeUserForAuthMe(currentUser!)

  res.status(200).json(normalizedCurrentUser)
})

authRouter.post('/login',
  body('login').isString().trim().withMessage({message: 'login is incorrect', field: 'login'}),
  body('password').isString().trim().withMessage({message: 'password is incorrect', field: 'password'}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }
    const user = await authRepository.checkCredentials(req.body)

    if (user) {
      const token = await jwtService.createJWT(user)
      res.status(200).json(token)
    } else {
      res.sendStatus(401)
    }
  })

authRouter.post('/registration',
  body('email').isEmail().trim().withMessage({message: 'email is incorrect', field: 'email'}),
  body('login').isString().trim().isLength({min: 3, max: 10}).withMessage({
    message: 'login is incorrect',
    field: 'login'
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
  body('code').isString().trim().withMessage({message: 'code is incorrect', field: 'code'}),
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
  body('email').isEmail().trim().withMessage({message: 'email is incorrect', field: 'email'}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const user = await usersRepository.findUserByEmail(req.body.email)

    if (!user) {
      res.sendStatus(404)
      return
    }
    if (user.emailConfirmation.isConfirmed) {
      res.sendStatus(400)
      return
    }

    const result = await emailsManager.sendEmailConfirmationMessage(user)

    if (result) {
      res.sendStatus(204)
    } else {
      res.sendStatus(400)
    }
  })
