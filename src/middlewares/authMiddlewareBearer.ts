import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../application/jwt-service';
import {users} from '../repositories/db';
import {settings} from '../settings';

export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {
  const authValue = req.headers.authorization

  if (!authValue) {
    res.sendStatus(401)
    return
  }

  const token = authValue.split(' ')[1]

  const tokenData = await jwtService.verifyUserByToken(token, settings.JWT_SECRET)

  if (tokenData) {
    const user = await users.findOne({id: tokenData.userId})
    if (user) {
      req.user = user
      next()
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(401)
  }
}
