import { AddSurveyModel } from '../../../../domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '../../../protocols/db/db-survey/add-survey-repository'
import { DbAddSurvey } from './db-add-survey'

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (value: AddSurveyModel): Promise<void> {
    }
  }
  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

const makeFakeSurveyModel = (): AddSurveyModel => {
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
