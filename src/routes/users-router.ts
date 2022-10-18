import {Request, Response, Router} from 'express';
import {usersRepositoryQuery} from '../repositories/users-repository/users-repositoryQuery';
import {UsersQueryParams} from '../utils/interfaces';


export const usersRouter = Router({})

usersRouter.get('/', async (req: Request<{}, {}, {}, UsersQueryParams>, res: Response) => {
  const allUsers = await usersRepositoryQuery.getAllUsers(req.query)

  res.status(200).json(allUsers)
})
