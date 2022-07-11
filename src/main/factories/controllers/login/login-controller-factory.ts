import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLoginValidationComposite } from './login-validation-factory'
import { makeAuthenticationFactory } from '../../usecases/db-authentication/db-authentication-usecase-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller.decorator'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(
    makeAuthenticationFactory(),
    makeLoginValidationComposite()
  )
  return makeLogControllerDecorator(controller)
}
