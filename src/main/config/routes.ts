import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'
// import FastGlob from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use(router)

  // // eslint-disable-next-line node/no-path-concat
  // readdirSync(`${__dirname}/../routes`).map(async file => {
  //   if (!file.includes('.test.')) {
  //     (await import(`../../../${file}`)).default(router)
  //   }
  // })

  // FastGlob.sync('**/src/main/routes/**routes.ts').map(async file => {
  //   (await import(`../../../${file}`)).default(router)
  // })

  readdirSync(path.join(__dirname, '/../routes')).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
