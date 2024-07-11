import { z } from 'zod'

export const sequelizeUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export type SequelizeUserSchema = z.infer<typeof sequelizeUserSchema>
