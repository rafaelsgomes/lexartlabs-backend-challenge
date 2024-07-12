import { Router } from 'express'
import { CreateProductController } from './createProductController'
import passport from '@/infra/auth/jwt.strategy'
import { FetchAllProductsController } from './fetchAllProductsController'

const createProductController = new CreateProductController()
const fetchAllProductsController = new FetchAllProductsController()

export const productsRoutes = Router()

productsRoutes.post(
  '/products',
  passport.authenticate('jwt', { session: false }),
  createProductController.handle.bind(createProductController),
)

productsRoutes.get(
  '/products/list',
  fetchAllProductsController.handle.bind(fetchAllProductsController),
)
