import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadByIdSurveyResultController } from '../factories/controllers/survey-result/load-by-id-survey-result/load-by-id-survey-result-controller-factory'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.put('/api/surveys/:surveyId/results', auth('user'), adaptRoute(makeSaveSurveyResultController()))
  router.get('/api/surveys/:surveyId/results', auth('user'), adaptRoute(makeLoadByIdSurveyResultController()))
}
