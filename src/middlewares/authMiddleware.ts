import {NextFunction, Request, Response} from 'express';
import {decodeBase64} from '../utils/decodeBase64';


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {

    const [login, password] = decodeBase64(req.headers.authorization)

    if (login === 'admin' && password === 'qwerty') {
      next()
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(401)
  }
}
