import { ValidationCompareFields } from '../../../presentation/helpers/validators/validation-compare-fields'
import { ValidationEmailValidator } from '../../../presentation/helpers/validators/validation-email-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { Validation } from '../../../presentation/helpers/validators/interface/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { ValidationRequiredFields } from '../../../presentation/helpers/validators/validation-required-field'

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
