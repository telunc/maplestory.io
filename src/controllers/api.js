import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import Server from './api/server'
import Item from './api/item'
import Character from './api/character'
import compression from 'compression'

const router = express.Router();

var oldRouteTest = new RegExp('\/fm\/world\/([0-9]*)\/rooms\/legacy', '')
//Convert objects appropriately
router.use('/', async (req, res, next) => {
  if(oldRouteTest.test(req.url)) {
    var serverId = oldRouteTest.exec(req.url)[1]
    console.log('Redirecting (old) legacy call for ' + serverId)
    res.redirect('/api/server/' + serverId + '/market/legacy')
  }

  res.success = (model) => {
    let results = null
    if(model instanceof Array)
      results = model.map((entry) => entry.toJSON ? entry.toJSON() : entry )
    else
      results = model.toJSON ? model.toJSON() : model

    res.set('Content-Type', 'application/json')
      .status(200)
      .send(JSON.stringify(results, null, 2))
  }

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  return next()
})

//Try to compress the objects, because 5Mb per request is costly
router.use(compression())

router.use('/server', Server)
router.use('/item', Item)
router.use('/character', Character)

export default router