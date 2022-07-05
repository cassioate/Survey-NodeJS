import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite, ValidationEmailValidator, ValidationRequiredFields } from '../../../presentation/helpers/validators/index'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidationComposite = (): Validation => {
  const validations: Validation[] = []
  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(new ValidationRequiredFields(field))
  }
  validations.push(new ValidationEmailValidator('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
