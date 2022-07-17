import { MissingParamError } from '../../presentation/errors'
import { ValidationRequiredFieldsInside } from './validation-required-field-inside'
import { AddSurveyModel } from '../../domain/usecases/survey/add-survey'

const fakeBody = (): AddSurveyModel => {
  return {
    question: 'who is more beautiful?',
    answers: [{
      answer: 'teste',
      image: 'testeImage'
    },
    {
      answer: 'teste2',
      image: 'testeImage2'
    },
    {
      answer: 'teste3',
      image: 'testeImage3'
    }]
  }
}

describe('ValidationRequiredFieldsInside', () => {
  test('Should return MissingParamError if no answer' +
  'is provided inside of answers and is a array', async () => {
    const sut = new ValidationRequiredFieldsInside('answers', 'answer')

    const newFakeBody = fakeBody()
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
    const result = await sut.validate(fakeBody())
    expect(result).toEqual(undefined)
  })
})
