import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationEmailValidator } from '../../../../presentation/helpers/validators/validation-email-validator'
import { ValidationRequiredFields } from '../../../../presentation/helpers/validators/validation-required-field'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { ValidationComposite } from '../../../../presentation/helpers/validators/validation-composite'
import { makeLoginValidationComposite } from './login-validation-factory'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

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
    makeLoginValidationComposite()
    const validations: Validation[] = []
    const fields = ['email', 'password']
    for (const field of fields) {
      validations.push(new ValidationRequiredFields(field))
    }
    validations.push(new ValidationEmailValidator('email', makeEmailValidator()))
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
