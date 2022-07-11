import { LogErrorRepositoryMongo } from '../../../infra/db/mongodb/log-error-repository/log-error-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logErrorRepositoryMongo = new LogErrorRepositoryMongo()
  return new LogControllerDecorator(controller, logErrorRepositoryMongo)
}
