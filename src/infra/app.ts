import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import path from 'node:path'
import YAML from 'yamljs'
import { userRoutes } from './http/controllers/users/usersRoutes'
import passport from './auth/jwt.strategy'
import { productsRoutes } from './http/controllers/products/productsRoutes'

export const app = express()

app.use(express.json())
app.use(
  cors({
    origin: '*',
  }),
)

const swaggerDocument = YAML.load(
  path.join(__dirname, './swagger/swagger.yaml'),
)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(passport.initialize())

app.use(userRoutes)
app.use(productsRoutes)
