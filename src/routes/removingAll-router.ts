import {Router} from 'express';
import {removingAllController} from '../composition-root';

export const removingAllRouter = Router({})

removingAllRouter.delete('/all-data', removingAllController.deleteAllData.bind(removingAllController))
