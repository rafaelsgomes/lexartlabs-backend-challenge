import fs from 'node:fs'
import * as path from 'path'
import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import { SequelizeProductModel } from '@/infra/database/sequelize/models/Product'
import request from 'supertest'
import { ProductFactory } from 'test/factories/makeProduct'
import { UserFactory } from 'test/factories/makeUser'

describe('Delete Product (E2E)', () => {
  let userFactory: UserFactory
  let productFactory: ProductFactory
  let jwtEncrypter: IEncrypter

  const filePath = path.resolve(
    __dirname,
    '../',
    '../',
    '../',
    '../',
    '../',
    'logs',
    'deleted-products',
  )
  let fileName = ''

  beforeAll(async () => {
    userFactory = new UserFactory()
    productFactory = new ProductFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[DELETE] /products', async () => {
    const user = await userFactory.makeSequelizeUser()

    await Promise.all([
      productFactory.makeSequelizeProduct({
        userId: user.id,
      }),
      productFactory.makeSequelizeProduct({
        userId: user.id,
      }),
      productFactory.makeSequelizeProduct({
        userId: user.id,
      }),
    ])

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    const response = await request(app)
      .delete(`/products/`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(204)
    const productOnDatabase = await SequelizeProductModel.findOne({
      where: {
        userId: user.id,
      },
    })
    expect(productOnDatabase).toBeNull()
    fileName = `${user.id}-deleted-products.json`
    expect(fs.existsSync(path.resolve(filePath, fileName))).toBeTruthy()
  })

  afterAll(() => {
    fs.unlinkSync(path.resolve(filePath, fileName))
  })
})
