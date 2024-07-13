import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import { SequelizeProductModel } from '@/infra/database/sequelize/models/Product'
import request from 'supertest'
import { UserFactory } from 'test/factories/makeUser'
import { waitFor } from 'test/utils/waitFor'

describe('Provide Products Test (E2E)', () => {
  let userFactory: UserFactory
  let jwtEncrypter: IEncrypter

  beforeAll(async () => {
    userFactory = new UserFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[POST] /products/test-products', async () => {
    const user = await userFactory.makeSequelizeUser()

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    const response = await request(app)
      .post('/products/test-products')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(201)
    await waitFor(async () => {
      const productsOnDatabase = await SequelizeProductModel.findAll({
        where: {
          userId: user.id,
        },
      })

      expect(productsOnDatabase).toBeTruthy()
      expect(productsOnDatabase.length).toEqual(50)
    })
  })
})
