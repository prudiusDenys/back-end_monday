import {Request, Response} from 'express';
import {RemovingAllRepository} from '../repositories/removingAll-repository';

export class RemovingAllController {
  constructor(protected removingAllRepository: RemovingAllRepository) {
  }

  async deleteAllData(req: Request, res: Response) {
    await this.removingAllRepository.removeAllData()
    res.sendStatus(204)
  }
}
