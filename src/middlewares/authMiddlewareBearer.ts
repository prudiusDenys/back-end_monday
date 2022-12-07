import {NextFunction, Request, Response} from 'express';
import {jwtService} from '../application/jwt-service';
import {settings} from '../settings';
import {Users} from '../mongoose/models';

export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {
  const authValue = req.headers.authorization

  if (!authValue) {
    res.sendStatus(401)
    return
  }

  const token = authValue.split(' ')[1]

  const tokenData = await jwtService.verifyUserByToken(token, settings.JWT_SECRET)

  if (tokenData) {
    const user = await Users.findOne({id: tokenData.userId}).select('-__v -_id')
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
