import express from 'express'
import setUpMiddleware from './middlewares'

const app = express()
setUpMiddleware(app)

export default app
