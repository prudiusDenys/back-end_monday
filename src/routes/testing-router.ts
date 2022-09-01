import {Request, Response, Router} from 'express';
import {testingRepository} from '../repositories/testing-repository';

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
  testingRepository.removeAllData()
  res.sendStatus(204)
})
