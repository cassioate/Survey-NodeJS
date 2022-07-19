import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/api/survey/add', auth('admin'), adaptRoute(makeAddSurveyController()))
}
