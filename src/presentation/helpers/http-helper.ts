import { HttpResponse } from '../protocols/http'

export const httpBadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: {
    name: error.name,
    message: error.message,
    stack: error.stack
  }
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
