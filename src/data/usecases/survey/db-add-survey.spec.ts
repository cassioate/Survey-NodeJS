import { SurveyModel } from '../../../domain/models/survey'
import { AddSurveyModel } from '../../../domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '../../protocols/db/db-survey/add-account-repository'
import { DbAddSurvey } from './db-add-survey'

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (value: AddSurveyModel): Promise<SurveyModel> {
      return {
        id: 'id_valid',
        ...value
      }
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
    }]
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

  test('Should return a SuveyModel if all goes ok', async () => {
    const { sut } = makeSut()
    const requestAddSuveyRepository = makeFakeSurveyModel()
    const result = await sut.add(requestAddSuveyRepository)
    expect(result).toEqual({
      id: 'id_valid',
      ...requestAddSuveyRepository
    })
  })
})
