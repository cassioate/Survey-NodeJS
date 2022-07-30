
import { Validation } from '../../../../../../src/presentation/protocols/validation'
import { ValidationRequiredFields, ValidationEmailValidator, ValidationComposite } from '../../../../../../src/validation/validators'
import { makeLoginValidationComposite } from '../../../../../../src/main/factories/controllers/login/login/login-validation-factory'
import { makeEmailValidator } from '../../../../../validation/mocks/email-validator-mock'

jest.mock('../../../../../../src/validation/validators/validation-composite')

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
