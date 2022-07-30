import { AddSurveyParams } from '../../../../../src/domain/models/survey'
import { AddSurveyRepository } from '../../../../../src/data/protocols/db/db-survey/add-survey-repository'
import { DbAddSurvey } from '../../../../../src/data/usecases/survey/add-survey/db-add-survey'
import { makeAddSurveyRepositoryStub } from '../../../mocks/db-survey-mock'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

const makeFakeSurveyModel = (): AddSurveyParams => {
  return {
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }],
    date: new Date()
  }
}

describe('AddSurvey', () => {
  test('Should call addSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const spyOnSurveyRepository = jest.spyOn(addSurveyRepositoryStub, 'add')
    const requestAddSuveyRepository = makeFakeSurveyModel()
    await sut.add(requestAddSuveyRepository)
    expect(spyOnSurveyRepository).toBeCalledWith(requestAddSuveyRepository)
  })

  test('Should throw if addSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const requestAddSuveyRepository = makeFakeSurveyModel()
    await expect(sut.add(requestAddSuveyRepository)).rejects.toThrow()
  })
})
