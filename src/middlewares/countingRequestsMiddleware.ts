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
  const limitSecondsRate= 10
  const maxAttempts = 5
  const apiRequestTime = (nowDate - request.date) / 1000

  if (apiRequestTime > limitSecondsRate) {
    request.date = new Date()
    request.attempts = 1
    return next()
  }

  request.attempts += 1

  if (apiRequestTime < limitSecondsRate && request.attempts <= maxAttempts) {
    // if (request.attempts === 0) {
    //   request.date = new Date()
    // }
    return next()
  }
  if (apiRequestTime < limitSecondsRate && request.attempts > maxAttempts) {
    res.sendStatus(429)
  }
}
