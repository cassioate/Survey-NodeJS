import { loginPath } from './paths/loginPath'
import { errorSchema } from './schemas/errors/error-schema'
import { loginParamsSchema } from './schemas/login/login-params-schema'
import { badRequest } from './components/bad-request'
import { unauthorized } from './components/unauthorized'
import { internalServer } from './components/internal-server'
import { notFound } from './components/not-found'
import { accessTokenSchema } from './schemas/login/access-token-schema'
import { signUpPath } from './paths/signUpPath'
import { forbidden } from './components/forbidden'
import { signUpParamsSchema } from './schemas/login/sign-up-params-schema'
import { apiKeyAuthSchema } from './schemas/security/api-key-auth-schema'
import { surveyAnswerSchema } from './schemas/survey/survey-answer-schema'
import { surveySchema } from './schemas/survey/survey-schema'
import { surveyPath } from './paths/survey-path'
import { surveysSchema } from './schemas/survey/surveys-schema'
import { surveysResultPath } from './paths/survey-result-path'
import { surveyResultParamsSchema } from './schemas/survey-results/survey-result-params-schema'
import { surveyResultAnswerSchema } from './schemas/survey-results/survey-result-answer-schema'
import { surveyResultSchema } from './schemas/survey-results/survey-result-schema'
import { surveyParamsSchema } from './schemas/survey/survey-params-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey-NodeJS',
    description: 'API para realizar enquetes',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys/': surveyPath,
    '/surveys/{surveyId}/results': surveysResultPath
  },
  schemas: {
    // login
    loginParams: loginParamsSchema,
    loginSuccess: accessTokenSchema,
    signUpParams: signUpParamsSchema,
    signUpSuccess: accessTokenSchema,

    // enquete
    surveyParams: surveyParamsSchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    survey: surveySchema,

    // reposta enquete
    surveysResultParams: surveyResultParamsSchema,
    surveysResultAnswer: surveyResultAnswerSchema,
    surveysResult: surveyResultSchema,

    // errors
    error: errorSchema
  },
  components: {
    securitySchemes: apiKeyAuthSchema,
    badRequest,
    unauthorized,
    internalServer,
    notFound,
    forbidden
  }
}
