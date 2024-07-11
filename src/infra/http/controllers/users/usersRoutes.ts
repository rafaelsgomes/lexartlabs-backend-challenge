import { Router } from 'express'
import { CreateUserController } from './createUserController'

const createUserController = new CreateUserController()

export const userRoutes = Router()

userRoutes.post(
  '/users',
  createUserController.handle.bind(createUserController),
)
