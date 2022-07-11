
import { Controller } from '../../../../presentation/protocols'
import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { makeSignUpValidationComposite } from './signup-validation-factory'
import { makeAuthenticationFactory } from '../../usecases/db-authentication/db-authentication-usecase-factory'
import { makeAddAccountFactory } from '../../usecases/add-account/add-account-uscase-facoty'
import { makeLogControllerDecorator } from '../../decorators/log-controller.decorator'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeAddAccountFactory(),
    makeSignUpValidationComposite(),
    makeAuthenticationFactory()
  )
  return makeLogControllerDecorator(controller)
}
