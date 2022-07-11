
import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'
import { EmailValidator } from '../protocols/email-validator'

export class ValidationEmailValidator implements Validation {
  private readonly emailField: string
  private readonly emailValidator: EmailValidator

  constructor (emailField: string, emailValidator: EmailValidator) {
    this.emailField = emailField
    this.emailValidator = emailValidator
  }

  async validate (input: any): Promise<Error> {
    if (!this.emailValidator.isValid(input[this.emailField])) {
      return new InvalidParamError('email')
    }
  }
}
