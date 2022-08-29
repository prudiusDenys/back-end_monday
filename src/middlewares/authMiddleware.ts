import {NextFunction, Request, Response} from 'express';
import {decodeBase64} from '../utils/decodeBase64';


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const authValue = req.headers.authorization

  if (authValue) {
    const basic = authValue.split(' ')[0]

    const [login, password] = decodeBase64(authValue)

    if (basic === 'Basic' && login === 'admin' && password === 'qwerty') {
      next()
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(401)
  }
}
