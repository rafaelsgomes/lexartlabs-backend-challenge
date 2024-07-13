import { Router } from 'express'
import { CreateProductController } from './createProductController'
import passport from '@/infra/auth/jwt.strategy'
import { FetchAllProductsController } from './fetchAllProductsController'
import { FetchProductsByUserIdController } from './fetchProductsByUserIdController'
import { GetProductByIdController } from './getProductController'
import { UpdateProductController } from './updateProductController'
import { DeleteProductController } from './deleteProductController'
import { DeleteAllProductsByUserIdController } from './deleteAllProductsByUserIdController'
import { SearchProductsController } from './searchProductsController'
import { GetLogOfDeletedProductsController } from './getLogOfDeletedProductsController'
import { ProvideProductsTestController } from './provideProductsTestController'

const createProductController = new CreateProductController()
const fetchAllProductsController = new FetchAllProductsController()
const fetchProductsByUserIdController = new FetchProductsByUserIdController()
const getProductByIdController = new GetProductByIdController()
const updateProductController = new UpdateProductController()
const deleteProductController = new DeleteProductController()
const searchProductsController = new SearchProductsController()
const deleteAllProductsByUserIdController =
  new DeleteAllProductsByUserIdController()
const getLogOfDeletedProductsController =
  new GetLogOfDeletedProductsController()
const provideProductsTestController = new ProvideProductsTestController()

export const productsRoutes = Router()

productsRoutes.post(
  '/products',
  passport.authenticate('jwt', { session: false }),
  createProductController.handle.bind(createProductController),
)

productsRoutes.post(
  '/products/test-products',
  passport.authenticate('jwt', { session: false }),
  provideProductsTestController.handle.bind(provideProductsTestController),
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
  '/products/search',
  searchProductsController.handle.bind(searchProductsController),
)

productsRoutes.get(
  '/products/logs',
  passport.authenticate('jwt', { session: false }),
  getLogOfDeletedProductsController.handle.bind(
    getLogOfDeletedProductsController,
  ),
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
