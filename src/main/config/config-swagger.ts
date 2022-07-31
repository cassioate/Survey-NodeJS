import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerConfig from '../docs/swagger/index'

export default (app: Express): void => {
  app.use('/api-docs', serve, setup(swaggerConfig))
}