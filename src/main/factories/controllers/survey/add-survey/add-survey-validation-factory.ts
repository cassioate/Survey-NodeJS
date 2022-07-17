import { Validation } from '../../../../../presentation/protocols'
import { ValidationRequiredFields, ValidationComposite } from '../../../../../validation/validators'
import { ValidationRequiredFieldsInside } from '../../../../../validation/validators/validation-required-field-inside'

export const makeAddSurveyValidationComposite = (): Validation => {
  const validations: Validation[] = []
  const fields = ['question', 'answers']
  for (const field of fields) {
    validations.push(new ValidationRequiredFields(field))
  }
  validations.push(new ValidationRequiredFieldsInside('answers', 'answer'))
  return new ValidationComposite(validations)
}
