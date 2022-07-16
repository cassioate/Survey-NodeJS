import { UnauthorizedError } from '../../errors/authentication-error'
import { HttpResponse } from '../../protocols/http'

export const httpBadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    name: error.name,
    message: error.message,
    stack: error.stack
  }
})

export const httpForbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: {
    name: error.name,
    message: error.message,
    stack: error.stack
  }
})

export const httpUnauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const httpServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: {
    name: error.name,
    message: error.message,
    stack: error.stack
  }
})

export const httpOk = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const httpNoContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})
