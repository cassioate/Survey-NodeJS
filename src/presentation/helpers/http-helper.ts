import { HttpResponse } from '../protocols/http'

export const httpBadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const httpServerError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error
})

export const httpOk = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
