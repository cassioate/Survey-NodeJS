import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class ValidationRequiredFields implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  async validate (input: any): Promise<Error> {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
