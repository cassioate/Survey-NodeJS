import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import app from './config/app'
import env from './config/env'
import { setUpRoles } from './config/roles'

// Irá conectar com o banco e depois subirá a aplicação com express na porta escolhida em env.port
MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    await setUpRoles()
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(console.error)
