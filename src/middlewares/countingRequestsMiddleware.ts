import {NextFunction, Request, Response} from 'express';

const requests: any[] = [];

//TODO check url. because now if we 2 requets to login and then 1 request to registration.
// It should 2 attemptsfor login and 1 to reg.

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

  //-1 > -10

  if (((request.date - nowDate) / 1000) > -10 && request.attempts < 5) {
    if (request.attempts === 0) {
      request.date = new Date()
    }
    return next()
  }
  if (((request.date - nowDate) / 1000) > -10 && request.attempts > 5) {
    res.sendStatus(429)
  }
}
