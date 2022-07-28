import { InvalidParamError } from '../../../src/presentation/errors'
import { EmailValidator } from '../../../src/validation/protocols/email-validator'
import { ValidationEmailValidator } from '../../../src/validation/validators/validation-email-validator'
import { makeFakeAddAccountParamsWithPassConfirmation } from '../../domain/models/mocks/mock-account'
import { makeEmailValidator } from '../mocks/email-validator-mock'

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

describe('ValidationRequiredFields', () => {
  test('Should throw if isValid throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error('isValid throws')
    })
    const result = sut.validate(makeFakeAddAccountParamsWithPassConfirmation())
    await expect(result).rejects.toThrow('isValid throws')
  })

  test('Should validate return InvalidParamError', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      return false
    })
    const newFakeBody = { ...makeFakeAddAccountParamsWithPassConfirmation() }
    newFakeBody.email = 'email_invalid'
    const result = await sut.validate(newFakeBody)
    expect(result).toEqual(new InvalidParamError('email'))
  })

  test('Should validate return undefined', async () => {
    const { sut } = makeSut()
    const result = await sut.validate(makeFakeAddAccountParamsWithPassConfirmation())
    expect(result).toBe(undefined)
  })
})
