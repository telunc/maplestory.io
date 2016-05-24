import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import FMApi from './api/fm'
import compression from 'compression'
import apicache from 'apicache'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY } from '../environment'

const caching = apicache.options({
  debug: ENV.NODE_ENV == 'development',
  defaultDuration: 60000,
  enabled: true
}).middleware

const router = express.Router();

//Convert objects appropriately
router.use('/', (req, res, next) => {
  res.success = (model) => {
    if(model instanceof Array)
      return res.status(200).send(model.map((entry) => entry.toJSON ? entry.toJSON() : entry ))

    res.status(200).send(model.toJSON ? model.toJSON() : model)
  }
  next()
})
//Try to compress the objects, because 5Mb per request is costly
router.use(compression())
//Try to cache the results for at least 60 seconds as CPU is also costly
router.use(caching())

router.use('/fm', FMApi)

export default router