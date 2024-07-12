import { Router } from 'express'
import { CreateProductController } from './createProductController'
import passport from '@/infra/auth/jwt.strategy'

const createProductController = new CreateProductController()

export const productsRoutes = Router()

productsRoutes.post(
  '/products',
  passport.authenticate('jwt', { session: false }),
  createProductController.handle.bind(createProductController),
)
