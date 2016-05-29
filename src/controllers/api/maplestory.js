import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import MapleItem from '../../models/mapleitem'
import API from '../../lib/API'

const router = express.Router();

router.use('/', (req, res, next) => {
  res.success = (model) => {
    if(model instanceof Array)
      return res.status(200).send(model.map((entry) => entry.toJSON ? entry.toJSON() : entry ))

    res.status(200).send(model.toJSON ? model.toJSON() : model)
  }
  next()
})

API.registerCall(
  '/api/maplestory/item/:itemId/icon',
  'Gets the inventory icon of an item',
  API.createParameter(':itemId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
  'Image/PNG'
)

router.get('/item/:itemId/icon', async (req, res, next) => {
  var itemId = Number(req.params.itemId)

  const item = await MapleItem.findFirst({id: itemId})

  if(!item || !item.Icon || !item.Icon.Icon) return res.status(404).send("Couldn't find an icon for that item.")

  var iconData = new Buffer(item.Icon.Icon, 'base64')
  res.set('Content-Type', 'image/png')
  res.send(iconData)
  console.log('woot')
})

API.registerCall(
  '/api/maplestory/item/:itemId/iconRaw',
  'Gets the raw icon of an item',
  API.createParameter(':itemId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
  'Image/PNG'
)

router.get('/item/:itemId/iconRaw', async (req, res, next) => {
  var itemId = Number(req.params.itemId)

  const item = await MapleItem.findFirst({id: itemId})

  if(!item || !item.Icon || !item.Icon.IconRaw) return res.status(404).send("Couldn't find an icon for that item.")

  var iconData = new Buffer(item.Icon.IconRaw, 'base64')
  res.set('Content-Type', 'image/png')
  res.send(iconData)

  res.status(500).send(ex)
})

export default router