import { InvalidParamError } from '../../../src/presentation/errors'
import { EmailValidator } from '../../../src/validation/protocols/email-validator'
import { ValidationEmailValidator } from '../../../src/validation/validators/validation-email-validator'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutType {
  sut: ValidationEmailValidator
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new ValidationEmailValidator('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const fakeBody = {
  name: 'Cassio',
  email: 'cassio@gmail.com',
  password: '123456',
  passwordConfirmation: '123456'
}

describe('ValidationRequiredFields', () => {
  test('Should throw if isValid throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error('isValid throws')
    })
    const result = sut.validate(fakeBody)
    await expect(result).rejects.toThrow('isValid throws')
  })

  test('Should validate return InvalidParamError', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      return false
    })
    const newFakeBody = { ...fakeBody }
    newFakeBody.email = 'email_invalid'
    const result = await sut.validate(newFakeBody)
    expect(result).toEqual(new InvalidParamError('email'))
  })

  test('Should validate return undefined', async () => {
    const { sut } = makeSut()
    const result = await sut.validate(fakeBody)
    expect(result).toBe(undefined)
  })
})
