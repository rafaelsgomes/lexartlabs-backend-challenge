import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import request from 'supertest'
import { ProductFactory } from 'test/factories/makeProduct'
import { UserFactory } from 'test/factories/makeUser'

describe('Fetch User Products (E2E)', () => {
  let userFactory: UserFactory
  let productFactory: ProductFactory
  let jwtEncrypter: IEncrypter

  beforeAll(async () => {
    userFactory = new UserFactory()
    productFactory = new ProductFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[GET] /products/user-products?page=1', async () => {
    const user = await userFactory.makeSequelizeUser()

    await productFactory.makeSequelizeProduct({
      name: 'product test e2e',
      userId: user.id,
    })

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    const response = await request(app)
      .get('/products/user-products?page=1')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        products: expect.arrayContaining([
          expect.objectContaining({
            name: 'product test e2e',
          }),
        ]),
      }),
    )
  })
})
