import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import Room from '../models/room'

const router = express.Router();

router.use('/', (req, res, next) => {
  res.success = (model) => {
    if(model instanceof Array)
      return res.status(200).send(model.map((entry) => entry.toJSON ? entry.toJSON() : entry ))
    
    res.status(200).send(model.toJSON ? model.toJSON() : model)
  }
  next()
})

router.get('/world/:worldId', async (req, res, next) => {
  var worldId = req.params.worldId
  console.log(worldId);
  try{
    const rooms = await Room.find(worldId)
    console.log('Got rooms')
    res.success(rooms)
  }catch(ex){
    res.status(500).send(ex)
  }
})

export default router