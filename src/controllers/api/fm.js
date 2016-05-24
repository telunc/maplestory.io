import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import Room from '../../models/room'

const router = express.Router();

router.get('/world/:worldId', async (req, res, next) => {
  var worldId = req.params.worldId
  try{
    const rooms = await Room.find(worldId)
    res.success(rooms)
  }catch(ex){
    res.status(500).send(ex)
  }
})

export default router