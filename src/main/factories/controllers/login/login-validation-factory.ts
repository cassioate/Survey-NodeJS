import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite, ValidationEmailValidator, ValidationRequiredFields } from '../../../../validation/validators/index'

export const makeLoginValidationComposite = (): Validation => {
  const validations: Validation[] = []
  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(new ValidationRequiredFields(field))
  }
  validations.push(new ValidationEmailValidator('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
