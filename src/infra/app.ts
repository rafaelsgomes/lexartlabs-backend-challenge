import express from 'express'
import cors from 'cors'
import { userRoutes } from './http/controllers/users/usersRoutes'
export const app = express()

app.use(express.json())
app.use(cors())

app.use(userRoutes)
