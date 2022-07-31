import express from 'express'
import setUpMiddleware from './middlewares'
import setUpRoutes from './routes'
import setupSwagger from './config-swagger'

const app = express()
setupSwagger(app)
setUpMiddleware(app)
setUpRoutes(app)

export default app
