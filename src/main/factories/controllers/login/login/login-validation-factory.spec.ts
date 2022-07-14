
import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { ValidationRequiredFields, ValidationEmailValidator, ValidationComposite } from '../../../../../validation/validators'
import { makeLoginValidationComposite } from './login-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

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
