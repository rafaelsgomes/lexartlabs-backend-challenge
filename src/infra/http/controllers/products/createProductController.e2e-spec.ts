import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import { SequelizeProductModel } from '@/infra/database/sequelize/models/Product'
import { faker } from '@faker-js/faker'
import request from 'supertest'
import { UserFactory } from 'test/factories/makeUser'

describe('Create Product (E2E)', () => {
  let userFactory: UserFactory
  let jwtEncrypter: IEncrypter

  beforeAll(async () => {
    userFactory = new UserFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[POST] /products', async () => {
    const user = await userFactory.makeSequelizeUser()

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'product test e2e',
        description: 'product test e2e description',
        imageUrl: faker.image.url(),
      })

    expect(response.status).toBe(201)
    const productOnDatabase = await SequelizeProductModel.findOne({
      where: {
        userId: user.id,
      },
    })

    expect(productOnDatabase).toBeTruthy()
  })
})
