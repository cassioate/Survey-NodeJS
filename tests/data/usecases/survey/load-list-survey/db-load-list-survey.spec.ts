import { SurveyModel } from '../../../../../src/domain/models/survey'
import { LoadListSurveyRepository } from '../../../../../src/data/protocols/db/db-survey/load-survey-repository'
import { DbLoadListSurvey } from '../../../../../src/data/usecases/survey/load-list-survey/db-load-list-survey'
import MockDate from 'mockdate'

const makeLoadListSurveyRepository = (): LoadListSurveyRepository => {
  class LoadListSurveyRepositoryStub implements LoadListSurveyRepository {
    async loadListSurvey (): Promise<SurveyModel[]> {
      return makeFakeListSurvey()
    }
  }
  return new LoadListSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbLoadListSurvey
  loadListSurveyRepositoryStub: LoadListSurveyRepository
}

const makeSut = (): SutTypes => {
  const loadListSurveyRepositoryStub = makeLoadListSurveyRepository()
  const sut = new DbLoadListSurvey(loadListSurveyRepositoryStub)
  return {
    sut,
    loadListSurveyRepositoryStub
  }
}

const makeFakeListSurvey = (): SurveyModel[] => {
  const listSurvey = [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      },
      {
        answer: 'any_answer2',
        image: 'any_image2'
      }],
      date: new Date()
    },
    {
      id: 'any_id2',
      question: 'any_question2',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      },
      {
        answer: 'any_answer2',
        image: 'any_image2'
      },
      {
        answer: 'any_answer3',
        image: 'any_image3'
      },
      {
        answer: 'any_answer4',
        image: 'any_image4'
      }
      ],
      date: new Date()
    }
  ]

  return listSurvey
}

describe('LoadListSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should return a list of survey', async () => {
    const { sut } = makeSut()
    const result = await sut.loadListSurvey()
    expect(result).toEqual(makeFakeListSurvey())
  })

  test('Should call loadListSurveyRepository with correct values', async () => {
    const { sut, loadListSurveyRepositoryStub } = makeSut()
    const spyOnLoadList = jest.spyOn(loadListSurveyRepositoryStub, 'loadListSurvey')
    await sut.loadListSurvey()
    expect(spyOnLoadList).toBeCalled()
  })

  test('Should throw if loadListSurveyRepository throws', async () => {
    const { sut, loadListSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadListSurveyRepositoryStub, 'loadListSurvey').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.loadListSurvey()).rejects.toThrow()
  })
})
