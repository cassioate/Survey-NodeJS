import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerConfig from '../docs/swagger/index'
import { noCache } from '../middlewares/no-cache-for-swagger'

export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerConfig))
}
