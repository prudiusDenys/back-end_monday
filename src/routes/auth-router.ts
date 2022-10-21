import {Request, Response, Router} from 'express';
import {body, validationResult} from 'express-validator';
import {authRepository} from '../repositories/auth-repository/auth-repository';


export const authRouter = Router({})

authRouter.post('/login',
  body('login').isString().trim().withMessage({message: 'login is incorrect', field: 'login'}),
  body('password').isString().trim().withMessage({message: 'password is incorrect', field: 'password'}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }
    const isUser = await authRepository.login(req.body)

    if (isUser) {
      res.sendStatus(204)
    } else {
      res.sendStatus(401)
    }
  })
