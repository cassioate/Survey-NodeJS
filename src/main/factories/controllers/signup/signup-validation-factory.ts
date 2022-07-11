import { EmailValidatorAdapter } from '../../../../utils/email-validator-adapter'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationCompareFields, ValidationComposite, ValidationEmailValidator, ValidationRequiredFields } from '../../../../presentation/helpers/validators/index'

export const makeSignUpValidationComposite = (): Validation => {
  const validations: Validation[] = []
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of fields) {
    validations.push(new ValidationRequiredFields(field))
  }
  validations.push(new ValidationCompareFields('password', 'passwordConfirmation'))
  validations.push(new ValidationEmailValidator('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
