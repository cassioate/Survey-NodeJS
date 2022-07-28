import request from 'supertest'
import app from '../../../src/main/config/app'

describe('Cors Middleware', () => {
  test('Should return a content-type as json', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
