import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import World from './api/world'
import Item from './api/item'
import Character from './api/character'
import compression from 'compression'

const router = express.Router();

var oldRouteTest = new RegExp('\/fm\/world\/([0-9]*)\/rooms\/legacy', '')
//Convert objects appropriately
router.use('/', async (req, res, next) => {
  if(oldRouteTest.test(req.url)) {
    var worldId = oldRouteTest.exec(req.url)[1]
    console.log('Redirecting (old) legacy call for ' + worldId)
    res.redirect('/api/world/' + worldId + '/market/legacy')
  }

  res.success = (model) => {
    if(model instanceof Array)
      return res.status(200).send(model.map((entry) => entry.toJSON ? entry.toJSON() : entry ))

    res.status(200).send(model.toJSON ? model.toJSON() : model)
  }

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  return next()
})

//Try to compress the objects, because 5Mb per request is costly
router.use(compression())

router.use('/world', World)
router.use('/item', Item)
router.use('/character', Character)

export default router