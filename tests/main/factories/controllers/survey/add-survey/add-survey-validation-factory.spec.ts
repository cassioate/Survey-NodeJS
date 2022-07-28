import { Validation } from '../../../../../../src/presentation/protocols/validation'
import { ValidationRequiredFields, ValidationComposite } from '../../../../../../src/validation/validators'
import { ValidationRequiredFieldsInside } from '../../../../../../src/validation/validators/validation-required-field-inside'
import { makeAddSurveyValidationComposite } from '../../../../../../src/main/factories/controllers/survey/add-survey/add-survey-validation-factory'

jest.mock('../../../../../../src/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should Should call Validation Composite with all validations', async () => {
    const validations: Validation[] = []
    const fields = ['question', 'answers']
    for (const field of fields) {
      validations.push(new ValidationRequiredFields(field))
    }
    validations.push(new ValidationRequiredFieldsInside('answers', 'answer'))
    makeAddSurveyValidationComposite()
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
