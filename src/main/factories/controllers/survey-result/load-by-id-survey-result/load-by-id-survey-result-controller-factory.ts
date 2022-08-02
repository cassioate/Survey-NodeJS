import { LoadBySurveyIdResultController } from '../../../../../presentation/controllers/survey-result/load-by-id-survey-result/load-by-id-survey-result-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller.decorator'
import { makeDbLoadSurveyResultByIdFactory } from '../../../usecases/survey-result/load-by-id-survey-result-factory'

export const makeLoadByIdSurveyResultController = (): Controller => {
  const controller = new LoadBySurveyIdResultController(
    makeDbLoadSurveyResultByIdFactory()
  )
  return makeLogControllerDecorator(controller)
}
