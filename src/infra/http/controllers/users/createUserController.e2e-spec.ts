import request from 'supertest'
import { app } from '@/infra/app'
import { SequelizeUserModel } from '@/infra/database/sequelize/models/User'

describe('Create User (E2E)', () => {
  test('[POST] /users', async () => {
    const response = await request(app).post('/users').send({
      name: 'test e2e',
      email: 'test.e2e@test.com',
      password: '123456',
    })

    expect(response.status).toBe(201)
    const userOnDatabase = await SequelizeUserModel.findOne({
      where: {
        email: 'test.e2e@test.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
