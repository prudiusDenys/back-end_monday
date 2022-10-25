import {User} from '../utils/interfaces';

declare global {
  declare namespace Express {
    export interface Request {
      user: User
    }
  }
}
