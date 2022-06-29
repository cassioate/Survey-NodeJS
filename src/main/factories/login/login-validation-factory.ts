import { ValidationEmailValidator } from '@/presentation/helpers/validators/validation-email-validator'
import { ValidationRequiredFields } from '@/presentation/helpers/validators/validation-required-field'
import { EmailValidatorAdapter } from '@/utils/email-validator-adapter'
import { Validation } from '../../../presentation/helpers/validators/interface/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'

export const makeLoginValidationComposite = (): Validation => {
  const validations: Validation[] = []
  const fields = ['email', 'password']
  for (const field of fields) {
    validations.push(new ValidationRequiredFields(field))
  }
  validations.push(new ValidationEmailValidator('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
