import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller.decorator'
import { makeAddSurveyValidationComposite } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidationComposite()
  )
  return makeLogControllerDecorator(controller)
}
