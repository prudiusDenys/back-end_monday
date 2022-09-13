import {Request, Response, Router} from 'express';
import {testingRepository} from '../repositories/testing-repository';

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await testingRepository.removeAllData()
  res.sendStatus(204)
})
