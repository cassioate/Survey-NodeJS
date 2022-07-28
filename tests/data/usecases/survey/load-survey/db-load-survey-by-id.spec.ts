import { SurveyModel } from '../../../../../src/domain/models/survey'
import { LoadSurveyByIdRepository } from '../../../../../src/data/protocols/db/db-survey/load-survey-by-id-repository'
import { DbLoadSurveyById } from '../../../../../src/data/usecases/survey/load-survey/db-load-survey-by-id'
import MockDate from 'mockdate'

const makeLoadSurveyRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return makeFakeSurveyModel()
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

type SutType = {
  sut: DbLoadSurveyById
  loadSurveyRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutType => {
  const loadSurveyRepositoryStub = makeLoadSurveyRepository()
  const sut = new DbLoadSurveyById(loadSurveyRepositoryStub)
  return {
    sut,
    loadSurveyRepositoryStub
  }
}

const makeFakeSurveyModel = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'question',
    answers: [{
      image: 'image',
      answer: 'answer'
    }],
    date: new Date()
  }
}

describe('LoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call loadSurveyRepository.loadById with correct values', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const spyOn = jest.spyOn(loadSurveyRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(spyOn).toBeCalledWith('any_id')
  })

  test('Should return a survey when search by id', async () => {
    const { sut } = makeSut()
    const result = await sut.loadById('any_id')
    expect(result).toEqual(makeFakeSurveyModel())
  })

  test('Should throw if loadSurveyRepository.loadById throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.loadById('any_id')).rejects.toThrow()
  })
})
