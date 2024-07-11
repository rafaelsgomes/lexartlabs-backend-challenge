import { ExtractJwt, Strategy } from 'passport-jwt'
import passport from 'passport'
import { z } from 'zod'
import { env } from '../env'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(env.JWT_PUBLIC_KEY, 'base64'),
      algorithms: ['RS256'],
    },
    (payload: UserPayload, done) => {
      try {
        return done(null, tokenPayloadSchema.parse(payload))
      } catch (error) {
        return done(error, false)
      }
    },
  ),
)

export default passport
