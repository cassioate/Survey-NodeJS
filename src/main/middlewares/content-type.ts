import { NextFunction, Request, Response } from 'express'

export const contentType = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  // Nao pode esquecer do next, se não ele trava(timeout) aqui e não passa para o proximo middleware
  next()
}
