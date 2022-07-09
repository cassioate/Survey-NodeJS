import { LogErrorRepository } from '../../data/protocols/db/db-log/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logRepository: LogErrorRepository

  constructor (controller: Controller, logRepository: LogErrorRepository) {
    this.controller = controller
    this.logRepository = logRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest)
    if (response.statusCode === 500) {
      await this.logRepository.logError(response.body.stack)
    }
    return response
  }
}
