import { Router } from 'express'
import { CreateProductController } from './createProductController'
import passport from '@/infra/auth/jwt.strategy'
import { FetchAllProductsController } from './fetchAllProductsController'
import { FetchProductsByUserIdController } from './fetchProductsByUserIdController'
import { GetProductByIdController } from './getProductController'
import { UpdateProductController } from './updateProductController'
import { DeleteProductController } from './deleteProductController'
import { DeleteAllProductsByUserIdController } from './deleteAllProductsByUserIdController'

const createProductController = new CreateProductController()
const fetchAllProductsController = new FetchAllProductsController()
const fetchProductsByUserIdController = new FetchProductsByUserIdController()
const getProductByIdController = new GetProductByIdController()
const updateProductController = new UpdateProductController()
const deleteProductController = new DeleteProductController()
const deleteAllProductsByUserIdController =
  new DeleteAllProductsByUserIdController()

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

productsRoutes.get(
  '/products/:productId',
  getProductByIdController.handle.bind(getProductByIdController),
)

productsRoutes.put(
  '/products/:productId',
  passport.authenticate('jwt', { session: false }),
  updateProductController.handle.bind(updateProductController),
)

productsRoutes.delete(
  '/products/:productId',
  passport.authenticate('jwt', { session: false }),
  deleteProductController.handle.bind(deleteProductController),
)

productsRoutes.delete(
  '/products',
  passport.authenticate('jwt', { session: false }),
  deleteAllProductsByUserIdController.handle.bind(
    deleteAllProductsByUserIdController,
  ),
)
