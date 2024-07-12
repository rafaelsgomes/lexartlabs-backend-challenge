import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import { SequelizeProductModel } from '@/infra/database/sequelize/models/Product'
import request from 'supertest'
import { ProductFactory } from 'test/factories/makeProduct'
import { UserFactory } from 'test/factories/makeUser'

describe('Update Product (E2E)', () => {
  let userFactory: UserFactory
  let productFactory: ProductFactory
  let jwtEncrypter: IEncrypter

  beforeAll(async () => {
    userFactory = new UserFactory()
    productFactory = new ProductFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[PUT] /products/:productId', async () => {
    const user = await userFactory.makeSequelizeUser()

    const product = await productFactory.makeSequelizeProduct({
      name: 'product test e2e',
      userId: user.id,
    })

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    const response = await request(app)
      .put(`/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'product test e2e - updated',
        description: product.description,
        imageUrl: product.imageUrl,
      })

    expect(response.status).toBe(204)
    const productOnDatabase = await SequelizeProductModel.findOne({
      where: {
        userId: user.id,
      },
    })

    expect(productOnDatabase!.name).toEqual('product test e2e - updated')
    expect(productOnDatabase!.updatedAt).toEqual(expect.any(Date))
  })
})
