import { HttpRequest } from '../../presentation/protocols'
import { NextFunction, Request, Response } from 'express'
import { Middleware } from '../../presentation/protocols/middleware'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const httpResponse = await middleware.handle(httpRequest)
    console.log(httpResponse.statusCode)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
