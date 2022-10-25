import {Request, Response, Router} from 'express';
import {body, validationResult} from 'express-validator';
import {authRepository} from '../repositories/auth-repository/auth-repository';
import {jwtService} from '../application/jwt-service';

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
    const user = await authRepository.checkCredentials(req.body)

    if (user) {
      const token = await jwtService.createJWT(user)
      res.status(200).json(token)
    } else {
      res.sendStatus(401)
    }
  })
