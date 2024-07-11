import { env } from '@/infra/env'
import { Sequelize } from 'sequelize'

export async function sequelizeService() {
  const connection = new Sequelize(env.DATABASE_URL)
  try {
    await connection.authenticate()
    console.log('Connection with database has been established successfully.')
    return connection
  } catch (error) {
    await connection.close()
    console.error('Unable to connect to the database:', error)
    throw new Error(`${error}`)
  }
}
