import { env } from '@/infra/env'
import { Dialect, Sequelize } from 'sequelize'
import { generateUniqueDatabaseURL } from 'test/utils/setDBUrl'

export class SequelizeConnection {
  private static instance: Sequelize

  private constructor() {
    // Information needed to initialize database connection
    const dbName = env.DB_NAME as string
    const dbUser = env.DB_USER as string
    const dbHost = env.DB_HOST
    const dbDriver = env.DB_DRIVER as Dialect
    const dbPassword = env.DB_PASSWORD

    // Initialize connection
    SequelizeConnection.instance = new Sequelize({
      host: dbHost,
      dialect: dbDriver,
      database: env.NODE_ENV === 'test' ? generateUniqueDatabaseURL() : dbName,
      username: dbUser,
      password: dbPassword,
    })

    // Test connection
    SequelizeConnection.instance.authenticate().then(() => {
      console.log('Sequelize connected')
    })
  }

  public static getInstance(): Sequelize {
    if (!SequelizeConnection.instance) {
      new SequelizeConnection()
    }

    return SequelizeConnection.instance
  }
}
