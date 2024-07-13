import { app } from '@/infra/app'
import request from 'supertest'
import { ProductFactory } from 'test/factories/makeProduct'
import { UserFactory } from 'test/factories/makeUser'

describe('Search Products (E2E)', () => {
  let userFactory: UserFactory
  let productFactory: ProductFactory

  beforeAll(async () => {
    userFactory = new UserFactory()
    productFactory = new ProductFactory()
  })

  test('[GET] /products/search?q=test', async () => {
    const user = await userFactory.makeSequelizeUser()

    await productFactory.makeSequelizeProduct({
      name: 'product test e2e',
      userId: user.id,
    })

    const response = await request(app).get('/products/search?q=test').send()

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
