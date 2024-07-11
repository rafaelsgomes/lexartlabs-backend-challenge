import { z } from 'zod'

export const sequelizeProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export type SequelizeProductSchema = z.infer<typeof sequelizeProductSchema>
