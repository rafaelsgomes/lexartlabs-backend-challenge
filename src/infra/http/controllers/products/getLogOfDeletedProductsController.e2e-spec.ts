import fs from 'node:fs'
import * as path from 'path'
import { IEncrypter } from '@/domain/application/cryptography/encrypter'
import { app } from '@/infra/app'
import { JwtEncrypter } from '@/infra/cryptography/jwtEncrypter'
import request from 'supertest'
import { ProductLogFactory } from 'test/factories/makeProductLog'
import { UserFactory } from 'test/factories/makeUser'

describe('Get Product Log (E2E)', () => {
  let userFactory: UserFactory
  let productLogFactory: ProductLogFactory
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
    productLogFactory = new ProductLogFactory()
    jwtEncrypter = new JwtEncrypter()
  })

  test('[GET] /products/logs', async () => {
    const user = await userFactory.makeSequelizeUser()

    const token = await jwtEncrypter.encrypt({
      sub: user.id,
    })

    await productLogFactory.makeProductLogFile({
      name: 'product test e2e',
      userId: user.id,
    })

    await productLogFactory.makeProductLogFile({
      name: 'product 2 test e2e',
      userId: user.id,
    })

    const response = await request(app)
      .get(`/products/logs`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        productsLog: expect.arrayContaining([
          expect.objectContaining({
            name: 'product test e2e',
          }),
        ]),
      }),
    )
    fileName = `${user.id}-deleted-products.json`
  })
  afterAll(() => {
    fs.unlinkSync(path.resolve(filePath, fileName))
  })
})
