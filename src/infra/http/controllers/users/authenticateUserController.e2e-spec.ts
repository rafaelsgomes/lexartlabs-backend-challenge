import request from 'supertest'
import { app } from '@/infra/app'
import { UserFactory } from 'test/factories/makeUser'
import { hash } from 'bcryptjs'

describe('Create User (E2E)', () => {
  let userFactory: UserFactory

  beforeAll(async () => {
    userFactory = new UserFactory()
  })

  test('[POST] /users/authenticate', async () => {
    await userFactory.makeSequelizeUser({
      email: 'test.e2e@test.com',
      password: await hash('123456', 8),
    })

    const response = await request(app).post('/users/authenticate').send({
      email: 'test.e2e@test.com',
      password: '123456',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
