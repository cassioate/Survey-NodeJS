import { Validation } from '../../../../../../src/presentation/protocols/validation'
import { ValidationRequiredFields, ValidationCompareFields, ValidationEmailValidator, ValidationComposite } from '../../../../../../src/validation/validators'
import { makeSignUpValidationComposite } from '../../../../../../src/main/factories/controllers/login/signup/signup-validation-factory'
import { makeEmailValidator } from '../../../../../validation/mocks/email-validator-mock'

jest.mock('../../../../../../src/validation/validators/validation-composite')

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
