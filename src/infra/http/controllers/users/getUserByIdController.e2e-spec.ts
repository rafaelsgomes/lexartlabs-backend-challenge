import request from 'supertest'
import { app } from '@/infra/app'
import { UserFactory } from 'test/factories/makeUser'
import { hash } from 'bcryptjs'
import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'

describe('Get User (E2E)', () => {
  let userFactory: UserFactory
  let jwtEncrypter: IEncrypter

  beforeAll(async () => {
    userFactory = new UserFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[GET] /users', async () => {
    const user = await userFactory.makeSequelizeUser({
      email: 'test.e2e@test.com',
      password: await hash('123456', 8),
    })

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        email: 'test.e2e@test.com',
      }),
    })
  })
})
