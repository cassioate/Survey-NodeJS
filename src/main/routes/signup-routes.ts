import { Router } from 'express'

export default (router: Router): void => {
  router.post('/api/signup', (req, res) => {
    res.json({})
  })
}
