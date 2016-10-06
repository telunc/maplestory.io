import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import MapleItem from '../../models/mapleitem'
import World from '../../models/world'
import API from '../../lib/API'

const router = express.Router();

API.registerCall(
  '/api/maplestory/item/:itemId/icon',
  'Gets the inventory icon of an item',
  API.createParameter(':itemId', 'number', 'The ID of the item'),
  'Image/PNG'
)

router.get('/item/:itemId/icon', async (req, res, next) => {
  try{
    const itemId = Number(req.params.itemId)
    const item = await MapleItem.getFirst(itemId)

    if(!item || !item.Icon || !item.Icon.Icon) return res.status(404).send('Couldn\'t find an icon for that item.')

    const iconData = new Buffer(item.Icon.Icon, 'base64')
    res.set('Content-Type', 'image/png')
    res.send(iconData)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/maplestory/item/:itemId/iconRaw',
  'Gets the raw icon of an item',
  API.createParameter(':itemId', 'number', 'The ID of the item'),
  'Image/PNG'
)

router.get('/item/:itemId/iconRaw', async (req, res, next) => {
  try{
    const itemId = Number(req.params.itemId)
    const item = await MapleItem.getFirst(itemId)

    if(!item || !item.Icon || !item.Icon.IconRaw) return res.status(404).send('Couldn\'t find an icon for that item.')

    const iconData = new Buffer(item.Icon.IconRaw, 'base64')
    res.set('Content-Type', 'image/png')
    res.send(iconData)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/maplestory/world/:world/icon',
  'Gets the raw icon of a world',
  API.createParameter(':worldName', 'string', 'The ID of the item'),
  'Image/PNG'
)

router.get('/world/:worldName/icon', async (req, res, next) => {
  try{
    const worldName = req.params.worldName
    const world = await World.findFirst({id: worldName.toLowerCase()})

    if(!world || !world.icon) return res.status(404).send('Couldn\'t find an icon for that world.')

    const iconData = new Buffer(world.icon, 'base64')
    res.set('Content-Type', 'image/png')
    res.send(iconData)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

export default router