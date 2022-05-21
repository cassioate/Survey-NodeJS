import { HttpResponse } from '../protocols/http'

export const badRequestFuncHttpHelper = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const internalServerErrorFuncHttpHelper = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error
})
