import { InvalidParamError } from '../../../src/presentation/errors'
import { Validation } from '../../../src/presentation/protocols'
import { ValidationComposite } from '../../../src/validation/validators/validation-composite'
import { makeFakeAddAccountParamsWithPassConfirmation } from '../../domain/models/mocks/mock-account'
import { makeValidationStub } from '../mocks/validation-mocks'

interface SutType {
  sut: ValidationComposite
  validationStub: Validation
}

const makeSut = (): SutType => {
  const validationStub = makeValidationStub()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub
  }
}

describe('ValidationRequiredFields', () => {
  test('Should validate return undefined', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementation(async () => {
      return new InvalidParamError('passwordConfirmation')
    })
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
