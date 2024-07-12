import express from 'express'
import cors from 'cors'
import { userRoutes } from './http/controllers/users/usersRoutes'
import passport from './auth/jwt.strategy'
import { productsRoutes } from './http/controllers/products/productsRoutes'
export const app = express()

app.use(passport.initialize())

app.use(express.json())
app.use(cors())

app.use(userRoutes)
app.use(productsRoutes)
