import validator from 'validator'
import { EmailValidatorAdapter } from '../../../src/infra/validators/email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = await sut.isValid('invalid_email@email.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.isValid('valid_email@email.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', async () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    await sut.isValid('valid_email@email.com')
    expect(isEmailSpy).toBeCalledWith('valid_email@email.com')
  })
})
