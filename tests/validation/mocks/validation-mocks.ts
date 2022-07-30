import { Validation } from '../../../src/presentation/protocols'

export const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return undefined as unknown as Error
    }
  }
  return new ValidationStub()
}
