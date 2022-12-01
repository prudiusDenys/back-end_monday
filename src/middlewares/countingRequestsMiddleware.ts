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
    next()
  }

  const nowDate: any = new Date()

  if (((request.date - nowDate) / 1000) > -10 && request.attempts < 5) {
    request.attempts += 1
    next()
  } else if (((request.date - nowDate) / 1000) > -10 && request.attempts >= 5) {
    request.attempts = 0
    request.date = new Date()
    res.sendStatus(429)
  } else {
    request.date = new Date()
    request.attempts = 1
    next()
  }
}
