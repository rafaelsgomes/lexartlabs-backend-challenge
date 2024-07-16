import { env } from '@/infra/env'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

export function generateUniqueDatabaseURL() {
  const schemaId = randomUUID()
  if (!env.DB_URL) {
    throw new Error('Please provide a DB_URL environment variable')
  }
  const url = new URL(env.DB_URL)
  url.pathname = schemaId
  const urlString = url.toString()

  process.env.DB_URL = urlString

  execSync(`pnpm sequelize-cli db:create --url ${process.env.DB_URL}`)
  execSync(`pnpm sequelize db:migrate --url ${process.env.DB_URL}`)

  return schemaId
}
