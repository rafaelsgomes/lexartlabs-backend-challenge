import { ZodError } from 'zod'
import { app } from './app'
import { env } from './env'

async function main() {
  app
    .listen(env.PORT, () => {
      console.log(`HTTP server running on PORT ${env.PORT}`)
    })
    .on('error', (error) => {
      if (error instanceof ZodError) {
        app.response.status(400).send({
          message: 'Validation error',
          errors: error.flatten().fieldErrors,
        })
      }
    })
}
main()
