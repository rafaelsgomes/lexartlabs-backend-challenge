import { Router } from 'express'
import { CreateProductController } from './createProductController'
import passport from '@/infra/auth/jwt.strategy'
import { FetchAllProductsController } from './fetchAllProductsController'
import { FetchProductsByUserIdController } from './fetchProductsByUserIdController'

const createProductController = new CreateProductController()
const fetchAllProductsController = new FetchAllProductsController()
const fetchProductsByUserIdController = new FetchProductsByUserIdController()

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

productsRoutes.get(
  '/products/user-products',
  passport.authenticate('jwt', { session: false }),
  fetchProductsByUserIdController.handle.bind(fetchProductsByUserIdController),
)
