import request from 'supertest'
import { app } from '@/infra/app'
import { UserFactory } from 'test/factories/makeUser'
import { compare, hash } from 'bcryptjs'
import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import { SequelizeUserModel } from '@/infra/database/sequelize/models/User'

describe('Set New Password (E2E)', () => {
  let userFactory: UserFactory
  let jwtEncrypter: IEncrypter

  beforeAll(async () => {
    userFactory = new UserFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[PATCH] /users/update-password', async () => {
    const user = await userFactory.makeSequelizeUser({
      email: 'test.e2e@test.com',
      password: await hash('123456', 8),
    })

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    const response = await request(app)
      .patch('/users/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: '123456',
        newPassword: '123456789',
      })

    expect(response.status).toBe(204)
    const userOnDatabase = await SequelizeUserModel.findOne({
      where: {
        email: 'test.e2e@test.com',
      },
    })

    const isPasswordMatch = compare('123456789', userOnDatabase!.password)

    expect(isPasswordMatch).toBeTruthy()
  })
})
