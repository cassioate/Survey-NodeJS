import { InvalidParamError } from '../../errors'
import { Validation } from './interface/validation'

export class ValidationCompareFields implements Validation {
  private readonly fieldName: string
  private readonly fieldNameToCompare: string

  constructor (fieldName: string, fieldNameToCompare: string) {
    this.fieldName = fieldName
    this.fieldNameToCompare = fieldNameToCompare
  }

  async validate (input: any): Promise<Error> {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare)
    }
  }
}
