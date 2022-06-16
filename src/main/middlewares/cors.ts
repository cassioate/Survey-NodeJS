import { NextFunction, Request, Response } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-headers', '*')
  // Nao pode esquecer do next, se não ele trava(timeout) aqui e não passa para o proximo middleware
  next()
}
