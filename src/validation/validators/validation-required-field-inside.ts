import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class ValidationRequiredFieldsInside implements Validation {
  private readonly fieldName: string
  private readonly fieldNameInside: string

  constructor (fieldName: string, fieldNameInside: string) {
    this.fieldName = fieldName
    this.fieldNameInside = fieldNameInside
  }

  async validate (input: any): Promise<Error> {
    const fieldInside = input[this.fieldName]

    if (Array.isArray(fieldInside)) {
      for (const fieldInsideInArray of fieldInside) {
        if (!fieldInsideInArray[this.fieldNameInside]) {
          return new MissingParamError(this.fieldNameInside)
        }
      }
    } else if (!fieldInside[this.fieldNameInside]) {
      return new MissingParamError(this.fieldNameInside)
    }
  }
}
