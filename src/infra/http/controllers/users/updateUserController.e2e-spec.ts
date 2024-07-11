import request from 'supertest'
import { app } from '@/infra/app'
import { UserFactory } from 'test/factories/makeUser'
import { hash } from 'bcryptjs'
import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import { SequelizeUserModel } from '@/infra/database/sequelize/models/User'

describe('Update User (E2E)', () => {
  let userFactory: UserFactory
  let jwtEncrypter: IEncrypter

  beforeAll(async () => {
    userFactory = new UserFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[PUT] /users', async () => {
    const user = await userFactory.makeSequelizeUser({
      email: 'test.e2e@test.com',
      password: await hash('123456', 8),
    })

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'test e2e - updated',
        email: 'test.e2e-updated@test.com',
        password: '123456',
      })

    expect(response.status).toBe(204)
    const userOnDatabase = await SequelizeUserModel.findOne({
      where: {
        email: 'test.e2e-updated@test.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
