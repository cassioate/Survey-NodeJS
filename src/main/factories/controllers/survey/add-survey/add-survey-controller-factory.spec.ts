import { Validation } from '../../../../../presentation/protocols/validation'
import { ValidationRequiredFields, ValidationComposite } from '../../../../../validation/validators'
import { makeAddSurveyValidationComposite } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should Should call Validation Composite with all validations', async () => {
    const validations: Validation[] = []
    const fields = ['question', 'answers']
    for (const field of fields) {
      validations.push(new ValidationRequiredFields(field))
    }

    makeAddSurveyValidationComposite()
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
