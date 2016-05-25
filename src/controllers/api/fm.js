import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import Room from '../../models/room'
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
  '/world/:worldId/rooms',
  'Gets a list of rooms with the shops and items in a world.',
  API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
  [
    {
        "shops": {
            "shopId": {
                "characterName": "CharacterName",
                "id": "shopId",
                "items": [
                    "itemObject"
                ]
            }
        }
    }
  ]
)
router.get('/world/:worldId/rooms', async (req, res, next) => {
  var worldId = req.params.worldId
  console.log(worldId);
  try{
    const rooms = await Room.findRooms(worldId)
    res.success(rooms)
  }catch(ex){
    res.status(500).send(ex)
  }
})

API.registerCall(
  '/world/:worldId/room/:roomId',
  'Gets a list of shops and items in a specific room on a specific world.',
  [
    API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
    API.createParameter(':roomId', 'number', 'The ID of the room. (1-22)')
  ],
  {
      "shops": {
          "shopId": {
              "characterName": "CharacterName",
              "id": "shopId",
              "items": [
                  "itemObject"
              ]
          }
      }
  }
)
router.get('/world/:worldId/room/:roomId', async (req, res, next) => {
  var worldId = req.params.worldId
  var roomId = req.params.roomId
  try{
    const rooms = await Room.findRoom(worldId, 1, roomId)
    res.success(rooms)
  }catch(ex){
    res.status(500).send(ex)
  }
})

export default router