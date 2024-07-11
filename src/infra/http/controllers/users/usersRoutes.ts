import { Router } from 'express'
import { CreateUserController } from './createUserController'
import { AuthenticateUserController } from './authenticateUserController'

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()

export const userRoutes = Router()

userRoutes.post(
  '/users',
  createUserController.handle.bind(createUserController),
)
userRoutes.post(
  '/users/authenticate',
  authenticateUserController.handle.bind(authenticateUserController),
)
