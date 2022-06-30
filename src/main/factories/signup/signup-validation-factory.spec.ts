import { Validation } from '../../../presentation/helpers/validators/interface/validation'
import { ValidationCompareFields } from '../../../presentation/helpers/validators/validation-compare-fields'
import { ValidationEmailValidator } from '../../..//presentation/helpers/validators/validation-email-validator'
import { ValidationRequiredFields } from '../../../presentation/helpers/validators/validation-required-field'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidationComposite } from './signup-validation-factory'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should Should call Validation Composite with all validations', async () => {
    makeSignUpValidationComposite()
    const validations: Validation[] = []
    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      validations.push(new ValidationRequiredFields(field))
    }
    validations.push(new ValidationCompareFields('password', 'passwordConfirmation'))
    validations.push(new ValidationEmailValidator('email', makeEmailValidator()))
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
