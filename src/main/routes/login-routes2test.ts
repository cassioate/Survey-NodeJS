
// import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
// import request from 'supertest'
// import app from '../config/app'
// import env from '../config/env'

// describe('Login Routes', () => {
//   beforeAll(async () => {
//     await MongoHelper.connect(env.mongoUrl)
//   })

//   afterAll(async () => {
//     await MongoHelper.disconnect()
//   })

//   beforeEach(async () => {
//     const accountCollection = await MongoHelper.getCollection('accounts')
//     await accountCollection.deleteMany({})
//   })
//   test('Should make a login on success and return 200 status code', async () => {
//     const value = await request(app)
//       .post('/api/login')
//       .send({
//         email: 'cassio@gmail.com',
//         password: '123456'
//       })
//       .expect(200)
//     expect(value.body.password).toBeTruthy()
//   })
// })
