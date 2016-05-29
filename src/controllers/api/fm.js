import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import Room from '../../models/room'
import Item from '../../models/item'
import API from '../../lib/API'
import apicache from 'apicache'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY } from '../../environment'

const router = express.Router();

const caching = apicache.options({
  debug: ENV.NODE_ENV == 'development',
  defaultDuration: 60000,
  enabled: true
}).middleware

router.use('/', (req, res, next) => {
  res.success = (model) => {
    if(model instanceof Array)
      return res.status(200).send(model.map((entry) => entry.toJSON ? entry.toJSON() : entry ))

    res.status(200).send(model.toJSON ? model.toJSON() : model)
  }
  next()
})

//Try to cache the results for at least 60 seconds as CPU is also costly
router.use(caching())


API.registerCall(
  '/api/fm/world/:worldId/rooms',
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
  var worldId = Number(req.params.worldId)
  console.log(worldId);
  const rooms = await Room.findRooms(worldId)
  res.success(rooms)
})

API.registerCall(
  '/api/fm/world/:worldId/room/:roomId',
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
  var worldId = Number(req.params.worldId)
  var roomId = Number(req.params.roomId)
  const rooms = await Room.findRoom(worldId, 1, roomId)
  res.success(rooms)
})

API.registerCall(
  '/api/fm/world/:worldId/room/:roomId/items',
  'Gets a list of items in a specific room on a specific world.',
  [
    API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
    API.createParameter(':roomId', 'number', 'The ID of the room. (1-22)')
  ],
  [
    {
      cash: {cash:true},
      equip: {"accountSharable":null,"attack":null,"attackSpeed":null,"bdR":null,"bossReward":null,"charismaEXP":null,"charmEXP":null,"craftEXP":null,"durability":null,"equipTradeBlock":null,"exItem":null,"imdR":null,"incACC":null,"incCraft":null,"incDEX":null,"incEVA":null,"incINT":null,"incJump":null,"incLUK":null,"incMAD":null,"incMDD":null,"incMHP":null,"incMMP":null,"incPAD":null,"incPDD":null,"incSTR":null,"incSpeed":null,"islot":"MaPn","noPotential":null,"reqDEX":0,"reqINT":0,"reqJob":0,"reqJob2":null,"reqLUK":0,"reqLevel":0,"reqPOP":null,"reqSTR":0,"reqSpecJob":null,"senseEXP":null,"superiorEqp":null,"tradeAvailable":null,"tradeBlock":null,"tuc":null,"unchangeable":null,"vslot":"MaPn","willEXP":null},
      icon: {
        icon: 'base64/png',
        iconRaw: 'base64/png'
      },
      shop: {"monsterBook":false,"notSale":false,"price":100},
      chair: {"recoveryHP":100,"recoveryMP":50,"reqLevel":0},
      description: "Some really awesome item",
      ItemId: 0,
      name: "Pro Item",
      slot: 0,
      acc: 0,
      avoid: 0,
      battleModeAtt: 0,
      bossDmg: 0,
      bundle: 0,
      category: 0,
      channel: 0,
      characterName: 0,
      createdAt: 0,
      creator: "SomeCoolGuy123456789",
      dex: 0,
      diligence: 0,
      durability: 0,
      expireTime: 0,
      growth: 0,
      hammerApplied: 0,
      ignoreDef: 0,
      intelligence: 0,
      isIdentified: 0,
      jump: 0,
      luk: 0,
      matk: 0,
      mdef: 0,
      mhp: 0,
      mmp: 0,
      nebulite: 0,
      numberOfEnhancements: 0,
      numberOfPlusses: 0,
      only: 0,
      potentials: 0,
      price: 0,
      quantity: 0,
      rarity: 0,
      room: 0,
      server: 0,
      shopID: 0,
      shopName: 0,
      speed: 0,
      str: 0,
      untradeable: 0,
      upgradesAvailable: 0,
      watk: 0,
      wdef: 0,
    }
  ]
)
router.get('/world/:worldId/room/:roomId/items', async (req, res, next) => {
  var worldId = Number(req.params.worldId)
  var roomId = Number(req.params.roomId)
  const items = await Item.findAll({room: roomId, server: worldId})
  res.success(items)
})

export default router