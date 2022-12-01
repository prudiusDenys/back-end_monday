import {NextFunction, Request, Response} from 'express';

const requests: any[] = [];

export const countingRequestsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const request = requests.find(request => request.api === req.ip)

  if (!request) {
    const requestData = {
      api: req.ip,
      attempts: 1,
      date: new Date()
    }
    requests.push(requestData)
   return next()
  }

  const nowDate: any = new Date()

  if (((request.date - nowDate) / 1000) < -10) {
    request.date = new Date()
    request.attempts = 1
    return next()
  }

  request.attempts += 1

  if (((request.date - nowDate) / 1000) > -10 && request.attempts <= 5) {
    if (request.attempts === 0) {
      request.date = new Date()
    }
    return next()
  }
  if (((request.date - nowDate) / 1000) > -10 && request.attempts > 5) {
    res.sendStatus(429)
  }
}
