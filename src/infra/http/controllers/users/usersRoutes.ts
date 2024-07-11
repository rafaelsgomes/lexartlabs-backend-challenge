import { Router } from 'express'
import passport from '../../../auth/jwt.strategy'
import { CreateUserController } from './createUserController'
import { AuthenticateUserController } from './authenticateUserController'
import { GetUserByIdController } from './getUserByIdController'
import { DeleteUserController } from './deleteUserController'
import { UpdateUserController } from './updateUserController'
import { SetNewPasswordController } from './setNewPasswordController'

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const getUserByIdController = new GetUserByIdController()
const deleteUserController = new DeleteUserController()
const updateUserController = new UpdateUserController()
const setNewPasswordController = new SetNewPasswordController()

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

userRoutes.put(
  '/users',
  passport.authenticate('jwt', { session: false }),
  updateUserController.handle.bind(updateUserController),
)

userRoutes.patch(
  '/users/update-password',
  passport.authenticate('jwt', { session: false }),
  setNewPasswordController.handle.bind(setNewPasswordController),
)
