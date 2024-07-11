import { Router } from 'express'
import { CreateUserController } from './createUserController'
import { AuthenticateUserController } from './authenticateUserController'
import { GetUserByIdController } from './getUserByIdController'
import passport from '../../../auth/jwt.strategy'

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const getUserByIdController = new GetUserByIdController()

export const userRoutes = Router()

userRoutes.post(
  '/users',
  createUserController.handle.bind(createUserController),
)
userRoutes.post(
  '/users/authenticate',
  authenticateUserController.handle.bind(authenticateUserController),
)

userRoutes.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  getUserByIdController.handle.bind(getUserByIdController),
)
