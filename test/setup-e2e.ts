import { SequelizeConnection } from '@/infra/database/sequelize'
import { execSync } from 'node:child_process'

afterAll(async () => {
  if (!process.env.DB_URL) {
    throw new Error('Please provide a DB_URL environment variable')
  }

  await SequelizeConnection.getInstance().close()

  execSync(`pnpm sequelize db:drop --url ${process.env.DB_URL}`)
})
