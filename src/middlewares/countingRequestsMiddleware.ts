import {NextFunction, Request, Response} from 'express';

const requests: any = [];

export const countingRequestsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const nowDate: any = new Date()
  const limitSecondsRate = 10
  const maxAttempts = 5

  const requestApi = requests.find((request: any) => request.api === req.ip)

  if (!requestApi) {
    const requestData = {
      api: req.ip,
      attemptsData: [
        {url: req.url, attempts: 1, date: nowDate}
      ]
    }
    requests.push(requestData)
    return next()
  }

  const urlData = requestApi.attemptsData.find((urlData: any) => urlData.url === req.url)

  if (!urlData) {
    requestApi.attemptsData.push({url: req.url, attempts: 1, date: nowDate})
    return next()
  }

  const apiRequestTime = (nowDate - urlData.date) / 1000

  if (apiRequestTime > limitSecondsRate) {
    urlData.date = nowDate
    urlData.attempts = 1
    return next()
  }

  urlData.attempts += 1

  if (apiRequestTime < limitSecondsRate && urlData.attempts <= maxAttempts) {
    return next()
  } else {
    res.sendStatus(429)
  }
}
