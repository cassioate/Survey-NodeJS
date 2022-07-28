
import { LoadListSurveyController } from '../../../../../presentation/controllers/survey/load-list-survey/load-list-survey-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller.decorator'
import { makeDbLoadListSurveyFactory } from '../../../usecases/survey/load-list-survey-factory'

export const makeLoadListSurveyController = (): Controller => {
  const controller = new LoadListSurveyController(
    makeDbLoadListSurveyFactory()
  )
  return makeLogControllerDecorator(controller)
}
