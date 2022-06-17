import express from 'express'
import setUpMiddleware from './middlewares'
import setUpRoutes from './routes'

const app = express()
setUpMiddleware(app)
setUpRoutes(app)

export default app
