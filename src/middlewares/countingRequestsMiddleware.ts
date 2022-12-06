import {NextFunction, Request, Response} from 'express';

const requests: any = [];

export const countingRequestsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const request = requests.find((request: any) => request.api === req.ip)

  if (!request) {
    const requestData = {
      api: req.ip,
      attemptsData: [
        {
          url: req.url,
          attempts: 1,
          date: new Date()
        }
      ]
    }
    requests.push(requestData)
   return next()
  }

  const attemptData =  request.attemptsData.find((attemptData: any) => attemptData.url === req.url)

  if(!attemptData){
    request.attemptsData.push({
      url: req.url,
      attempts: 1,
      date: new Date()
    })
    return next()
  }

  const nowDate: any = new Date()
  const limitSecondsRate= 10
  const maxAttempts = 5
  const apiRequestTime = (nowDate - attemptData.date) / 1000



  if (apiRequestTime > limitSecondsRate) {
    attemptData.date = new Date()
    attemptData.attempts = 1
    return next()
  }

  attemptData.attempts +=1

  if (apiRequestTime < limitSecondsRate && attemptData.attempts <= maxAttempts) {
    return next()
  }
  if (apiRequestTime < limitSecondsRate && attemptData.attempts > maxAttempts) {
    res.sendStatus(429)
  }
}
