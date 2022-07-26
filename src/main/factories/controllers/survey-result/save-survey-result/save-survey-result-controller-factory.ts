import { SaveSurveyResultController } from '../../../../../presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller.decorator'
import { makeDbSaveSurveyResultFactory } from '../../../usecases/survey-result/load-survey-by-id-factory'
import { makeDbLoadSurveyByIdFactory } from '../../../usecases/survey/load-survey-by-id-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyByIdFactory(),
    makeDbSaveSurveyResultFactory()
  )
  return makeLogControllerDecorator(controller)
}
