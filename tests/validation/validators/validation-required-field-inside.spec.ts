import { MissingParamError } from '../../../src/presentation/errors'
import { ValidationRequiredFieldsInside } from '../../../src/validation/validators/validation-required-field-inside'
import { makeFakeSurveyParams } from '../../domain/models/mocks/mock-survey'

describe('ValidationRequiredFieldsInside', () => {
  test('Should return MissingParamError if no answer' +
  'is provided inside of answers and is a array', async () => {
    const sut = new ValidationRequiredFieldsInside('answers', 'answer')

    const newFakeBody = makeFakeSurveyParams()
    newFakeBody.answers[0].answer = null as unknown as string

    const result = await sut.validate(newFakeBody)
    expect(result.message).toEqual(new MissingParamError('answer').message)
  })

  test('Should return MissingParamError if no answer' +
  'is provided inside of answers and is not a array', async () => {
    const sut = new ValidationRequiredFieldsInside('answers', 'answer')

    const newFakeBody = {
      question: 'who is more beautiful?',
      answers: {
        answer: null,
        image: 'testeImage'
      }
    }

    const result = await sut.validate(newFakeBody)
    expect(result.message).toEqual(new MissingParamError('answer').message)
  })

  test('Should return undefined if all fields are corrected passed', async () => {
    const sut = new ValidationRequiredFieldsInside('answers', 'answer')
    const result = await sut.validate(makeFakeSurveyParams())
    expect(result).toEqual(undefined)
  })
})
