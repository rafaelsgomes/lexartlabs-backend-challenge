import { Router } from 'express'
import { CreateUserController } from './createUserController'
import { AuthenticateUserController } from './authenticateUserController'
import { GetUserByIdController } from './getUserByIdController'
import passport from '../../../auth/jwt.strategy'
import { DeleteUserController } from './deleteUserController'

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const getUserByIdController = new GetUserByIdController()
const deleteUserController = new DeleteUserController()

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

userRoutes.delete(
  '/users',
  passport.authenticate('jwt', { session: false }),
  deleteUserController.handle.bind(deleteUserController),
)
