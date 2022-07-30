import { InvalidParamError } from '../../../src/presentation/errors'
import { ValidationCompareFields } from '../../../src/validation/validators/validation-compare-fields'
import { makeFakeAddAccountParamsWithPassConfirmation } from '../../domain/models/mocks/mock-account'

interface SutType {
  sut: ValidationCompareFields
}

const makeSut = (): SutType => {
  const sut = new ValidationCompareFields('password', 'passwordConfirmation')
  return {
    sut
  }
}

describe('ValidationRequiredFields', () => {
  test('Should validate return InvalidParamError', async () => {
    const { sut } = makeSut()
    const newFakeBody = { ...makeFakeAddAccountParamsWithPassConfirmation() }
    newFakeBody.passwordConfirmation = 'invalid_password'
    const result = await sut.validate(newFakeBody)
    expect(result).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should validate return undefined', async () => {
    const { sut } = makeSut()
    const result = await sut.validate(makeFakeAddAccountParamsWithPassConfirmation())
    expect(result).toBe(undefined)
  })
})
