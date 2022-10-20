import {Request, Response, Router} from 'express';
import {usersRepositoryQuery} from '../repositories/users-repository/users-repositoryQuery';
import {UsersQueryParams} from '../utils/interfaces';
import {usersService} from '../services/users-service';
import {body, validationResult} from 'express-validator';


export const usersRouter = Router({})

usersRouter.get('/', async (req: Request<{}, {}, {}, UsersQueryParams>, res: Response) => {
  const allUsers = await usersRepositoryQuery.getAllUsers(req.query)

  res.status(200).json(allUsers)
})

usersRouter.post('/',
  body('email').isEmail().withMessage({message: 'email is incorrect', field: 'email'}),
  body('login').isString().isLength({min: 3, max: 10}).withMessage({message: 'login is incorrect', field: 'login'}),
  body('password').isString().isLength({min: 6, max: 20}).withMessage({message: 'password is incorrect', field: 'password'}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorsMessages = errors.array().map(error => error.msg)
      return res.status(400).json({errorsMessages})
    }

    const createdUser = await usersService.createUser(req.body)

    return res.status(201).json(createdUser)

  })
