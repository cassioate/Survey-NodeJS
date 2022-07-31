import { loginPath } from './paths/loginPath'
import { loginSuccess } from './schemas/login-schema'
import { errorSchema } from './schemas/error-schema'
import { loginParamsSchema } from './schemas/login-params-schema'
import { badRequest } from './components/bad-request'
import { unauthorized } from './components/unauthorized'
import { internalServer } from './components/internal-server'
import { notFound } from './components/not-found'
import { signUpSuccess } from './schemas/sign-up-schema'
import { signUpPath } from './paths/signUpPath'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  // tags: [{
  //   name: 'Login'
  // }, {
  //   name: 'SignUp'
  // }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath
  },
  schemas: {
    loginParams: loginParamsSchema,
    loginSuccess: loginSuccess,
    signUpSuccess: signUpSuccess,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorized,
    internalServer,
    notFound
  }
}
