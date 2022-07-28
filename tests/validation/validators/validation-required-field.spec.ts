import { MissingParamError } from '../../../src/presentation/errors'
import { ValidationRequiredFields } from '../../../src/validation/validators/validation-required-field'
import { makeFakeAccount, makeFakeAddAccountParamsWithPassConfirmation } from '../../domain/models/mocks/mock-account'

describe('ValidationRequiredFields', () => {
  test('Should return MissingParamError if no name is provided', async () => {
    const sut = new ValidationRequiredFields('name')
    const newFakeBody = { ...makeFakeAccount() }
    newFakeBody.name = null as unknown as string
    const result = await sut.validate(newFakeBody)
    expect(result.message).toEqual(new MissingParamError('name').message)
  })

  test('Should return undefined if all fields are corrected passed', async () => {
    const sut = new ValidationRequiredFields('passwordConfirmation')
    const result = await sut.validate(makeFakeAddAccountParamsWithPassConfirmation())
    expect(result).toEqual(undefined)
  })
})
