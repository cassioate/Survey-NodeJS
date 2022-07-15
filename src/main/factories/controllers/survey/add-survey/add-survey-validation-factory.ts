import { Validation } from '../../../../../presentation/protocols'
import { ValidationRequiredFields, ValidationComposite } from '../../../../../validation/validators'

export const makeAddSurveyValidationComposite = (): Validation => {
  const validations: Validation[] = []
  const fields = ['question', 'answers']
  for (const field of fields) {
    validations.push(new ValidationRequiredFields(field))
  }
  return new ValidationComposite(validations)
}
