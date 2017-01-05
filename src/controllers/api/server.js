import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import Room from '../../models/room'
import Item from '../../models/item'
import Server from '../../models/server'
import World from '../../models/world'
import API from '../../lib/API'
import apicache from 'apicache'
import redis from 'redis'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY, REDIS_HOST, REDIS_PORT } from '../../environment'

const router = express.Router();

let redisClient
if (REDIS_HOST && REDIS_PORT) {
  redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
  })
  console.warn('Redis caching enabled')
} else {
  console.warn('Redis not enabled')
}

const caching = apicache.options({
    debug: ENV.NODE_ENV == 'development',
    defaultDuration: 60000,
    enabled: true,
    redisClient
  }).middleware

  //Try to cache the results for at least 60 seconds as CPU is also costly
router.use(caching())

API.registerCall(
  '/api/server/:worldId',
  'Gets a statistical data of a world.',
  API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
  {
    itemCount: 1000000,
    worlds: [
      {
        Icon: '...',
        id: '...'
      }
    ]
  }
)
router.get('/:worldId', async (req, res, next) => {
  try{
    const worldId = Number(req.params.worldId)
    if (Number.isNaN(worldId) || worldId === null || worldId === undefined) res.status(400).send({ error: 'Invalid world' })
    const world = await Server.findServer(worldId)
    res.send(world)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/server/:worldName/icon',
  'Gets the raw icon of a world',
  API.createParameter(':worldName', 'string', 'The ID of the item'),
  'Image/PNG'
)

router.get('/:worldName/icon', async (req, res, next) => {
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

API.registerCall(
  '/api/server/:worldId/market/itemCount',
  'Gets a count of items in the world.',
  API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
  1000000
)
router.get('/:worldId/market/itemCount', async (req, res, next) => {
  try{
    const worldId = Number(req.params.worldId)
    if (Number.isNaN(worldId) || worldId === null || worldId === undefined) res.status(400).send({ error: 'Invalid world' })
    const itemCount = await Item.getCount({server: worldId})
    res.send(itemCount.toString())
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/server/:worldId/market/legacy',
  'Gets all of the items in the world.',
  API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
  [{
    t: 'item.acc',
    u: 'item.avoid',
    B: 'item.battleModeAtt',
    C: 'item.bossDmg',
    b: 'item.bundle',
    Q: 'item.overallCategory',
    R: 'item.category',
    S: 'item.subCategory',
    E: 'item.creator',
    P: 'item.description',
    k: 'item.dex',
    v: 'item.diligence',
    y: 'item.growth',
    A: 'item.hammerApplied',
    T: 'item.itemId',
    D: 'item.ignoreDef',
    l: 'item.intelligence',
    F: 'item.isIdentified',
    x: 'item.jump',
    m: 'item.luk',
    q: 'item.matk',
    s: 'item.mdef',
    n: 'item.mhp',
    o: 'item.mmp',
    O: 'item.name',
    V: 'item.nebulite',
    H: 'item.numberOfEnhancements',
    i: 'item.numberOfPlusses',
    c: 'item.price',
    a: 'item.quantity',
    G: 'item.rarity',
    w: 'item.speed',
    j: 'item.str',
    h: 'item.upgradesAvailable',
    p: 'item.watk',
    r: 'item.wdef',
    U: 'item.itemId',
    d: 'room.channel',
    e: 'room.room',
    f: 'shop.shopName',
    g: 'shop.characterName'
  }]
)
router.get('/:worldId/market/legacy', async (req, res, next) => {
  try{
    const worldId = Number(req.params.worldId)
    if (Number.isNaN(worldId) || worldId === null || worldId === undefined) res.status(400).send({ error: 'Invalid world' })
    const rooms = await Room.findRooms(worldId)
    var mostRecentTimestamp = 0
    const items = rooms.reduce(function (allItems, room) {
      mostRecentTimestamp = Math.max(mostRecentTimestamp, room.createdAt)
      if (!room.shops.length) return allItems
      return allItems.concat.apply(allItems, room.shops.reduce(function (roomItems, shop) {
        if (!shop.items.length) return roomItems
        return roomItems.concat.apply(roomItems, shop.items.map(function (item) {
          var obscureItem = {
            t: item.acc,
            u: item.avoid,
            B: item.battleModeAtt,
            C: item.bossDmg,
            b: item.bundle,
            Q: item.overallCategory,
            R: item.category,
            S: item.subCategory,
            E: item.creator,
            P: item.description,
            k: item.dex,
            v: item.diligence,
            y: item.growth,
            A: item.hammerApplied,
            T: item.itemId,
            D: item.ignoreDef,
            l: item.intelligence,
            F: item.isIdentified,
            x: item.jump,
            m: item.luk,
            q: item.matk,
            s: item.mdef,
            n: item.mhp,
            o: item.mmp,
            O: item.name,
            V: item.nebulite,
            H: item.numberOfEnhancements,
            i: item.numberOfPlusses,
            c: item.price,
            a: item.quantity,
            G: item.rarity,
            w: item.speed,
            j: item.str,
            h: item.upgradesAvailable,
            p: item.watk,
            r: item.wdef,
            U: item.itemId,
            d: room.channel,
            e: room.room,
            f: shop.shopName,
            g: shop.characterName,
            I: item.potential1 ? item.potential1.line : undefined,
            J: item.potential2 ? item.potential2.line : undefined,
            K: item.potential3 ? item.potential3.line : undefined,
            L: item.bpotential1 ? item.bpotential1.line : undefined,
            M: item.bpotential2 ? item.bpotential2.line : undefined,
            N: item.bpotential3 ? item.bpotential3.line : undefined,
            Y: item.isCash
          }

          Object.keys(obscureItem).forEach((key) => {
            if (obscureItem[key] == -1 || obscureItem[key] === undefined) delete obscureItem[key]
          })

          return obscureItem
        }, []))
      }, []))
    }, [])
    const legacyResponse = [
      { fm_items: items },
      { seconds_ago: (Date.now() - mostRecentTimestamp) / 1000 }
    ]
    res.success(legacyResponse)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/server/:worldId/market/rooms',
  'Gets a list of rooms with the shops and items in a world.',
  API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
  [
    {
        'shops': {
            'shopId': {
                'characterName': 'CharacterName',
                'id': 'shopId',
                'items': [
                    'itemObject'
                ]
            }
        }
    }
  ]
)
router.get('/:worldId/market/rooms', async (req, res, next) => {
  try{
    const worldId = Number(req.params.worldId)
    if (Number.isNaN(worldId) || worldId === null || worldId === undefined) res.status(400).send({ error: 'Invalid world' })
    const rooms = await Room.findRooms(worldId)
    res.success(rooms)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/server/:worldId/market/room/:roomId',
  'Gets a list of shops and items in a specific room on a specific world.',
  [
    API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
    API.createParameter(':roomId', 'number', 'The ID of the room. (1-22)')
  ],
  {
      'shops': {
          'shopId': {
              'characterName': 'CharacterName',
              'id': 'shopId',
              'items': [
                  'itemObject'
              ]
          }
      }
  }
)
router.get('/:worldId/market/room/:roomId', async (req, res, next) => {
  try{
    const worldId = Number(req.params.worldId)
    if (Number.isNaN(worldId) || worldId === null || worldId === undefined) res.status(400).send({ error: 'Invalid world' })
    const roomId = Number(req.params.roomId)
    if (Number.isNaN(roomId) || roomId === null || roomId === undefined) res.status(400).send({ error: 'Invalid room' })
    const rooms = await Room.findRoom(worldId, 1, roomId)
    res.success(rooms)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/server/:worldId/market/room/:roomId/items',
  'Gets a list of items in a specific room on a specific world.',
  [
    API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
    API.createParameter(':roomId', 'number', 'The ID of the room. (1-22)')
  ],
  [
    {
      cash: {cash:true},
      equip: {'accountSharable':null,'attack':null,'attackSpeed':null,'bdR':null,'bossReward':null,'charismaEXP':null,'charmEXP':null,'craftEXP':null,'durability':null,'equipTradeBlock':null,'exItem':null,'imdR':null,'incACC':null,'incCraft':null,'incDEX':null,'incEVA':null,'incINT':null,'incJump':null,'incLUK':null,'incMAD':null,'incMDD':null,'incMHP':null,'incMMP':null,'incPAD':null,'incPDD':null,'incSTR':null,'incSpeed':null,'islot':'MaPn','noPotential':null,'reqDEX':0,'reqINT':0,'reqJob':0,'reqJob2':null,'reqLUK':0,'reqLevel':0,'reqPOP':null,'reqSTR':0,'reqSpecJob':null,'senseEXP':null,'superiorEqp':null,'tradeAvailable':null,'tradeBlock':null,'tuc':null,'unchangeable':null,'vslot':'MaPn','willEXP':null},
      icon: {
        icon: 'base64/png',
        iconRaw: 'base64/png'
      },
      shop: {'monsterBook':false,'notSale':false,'price':100},
      chair: {'recoveryHP':100,'recoveryMP':50,'reqLevel':0},
      description: 'Some really awesome item',
      ItemId: 0,
      name: 'Pro Item',
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
      creator: 'SomeCoolGuy123456789',
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
      potentials: [
        {
          'Message': '#prop% chance to ignore #ignoreDAM damage when attacked.',
          'Modifiers':[{'Item1':'prop','Item2':'30'},{'Item1':'ignoreDAM','Item2':'51'}],
          'OptionType':20,
          'id':20353,
          'target':'potential1',
          'line':'30% chance to ignore 51 damage when attacked.'
        }
      ],
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
router.get('/:worldId/market/room/:roomId/items', async (req, res, next) => {
  try{
    const worldId = Number(req.params.worldId)
    if (Number.isNaN(worldId) || worldId === null || worldId === undefined) res.status(400).send({ error: 'Invalid world' })
    const roomId = Number(req.params.roomId)
    if (Number.isNaN(roomId) || roomId === null || roomId === undefined) res.status(400).send({ error: 'Invalid room' })
    const items = await Item.findAll({room: roomId, server: worldId})
    res.success(items)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

API.registerCall(
  '/api/server/:worldId/market/items',
  'Gets a list of items in a specific room on a specific world.',
  [
    API.createParameter(':worldId', 'number', 'The ID of the world. (0 = Scania, 1 = Windia, 2 = Bera, 3 = Khroa, 4 = MYBCKN, 5 = GRAZED)'),
    API.createParameter(':roomId', 'number', 'The ID of the room. (1-22)')
  ],
  [
    {
      cash: {cash:true},
      equip: {'accountSharable':null,'attack':null,'attackSpeed':null,'bdR':null,'bossReward':null,'charismaEXP':null,'charmEXP':null,'craftEXP':null,'durability':null,'equipTradeBlock':null,'exItem':null,'imdR':null,'incACC':null,'incCraft':null,'incDEX':null,'incEVA':null,'incINT':null,'incJump':null,'incLUK':null,'incMAD':null,'incMDD':null,'incMHP':null,'incMMP':null,'incPAD':null,'incPDD':null,'incSTR':null,'incSpeed':null,'islot':'MaPn','noPotential':null,'reqDEX':0,'reqINT':0,'reqJob':0,'reqJob2':null,'reqLUK':0,'reqLevel':0,'reqPOP':null,'reqSTR':0,'reqSpecJob':null,'senseEXP':null,'superiorEqp':null,'tradeAvailable':null,'tradeBlock':null,'tuc':null,'unchangeable':null,'vslot':'MaPn','willEXP':null},
      icon: {
        icon: 'base64/png',
        iconRaw: 'base64/png'
      },
      shop: {'monsterBook':false,'notSale':false,'price':100},
      chair: {'recoveryHP':100,'recoveryMP':50,'reqLevel':0},
      description: 'Some really awesome item',
      ItemId: 0,
      name: 'Pro Item',
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
      creator: 'SomeCoolGuy123456789',
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
      potentials: [
        {
          'Message': '#prop% chance to ignore #ignoreDAM damage when attacked.',
          'Modifiers':[{'Item1':'prop','Item2':'30'},{'Item1':'ignoreDAM','Item2':'51'}],
          'OptionType':20,
          'id':20353,
          'target':'potential1',
          'line':'30% chance to ignore 51 damage when attacked.'
        }
      ],
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
router.get('/:worldId/market/items', async (req, res, next) => {
  try{
    const worldId = Number(req.params.worldId)
    if (Number.isNaN(worldId) || worldId === null || worldId === undefined) res.status(400).send({ error: 'Invalid world' })
    const roomId = Number(req.params.roomId)
    if (Number.isNaN(roomId) || roomId === null || roomId === undefined) res.status(400).send({ error: 'Invalid room' })
    const items = await Item.findAll({server: worldId})
    res.success(items)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null, stack: ex.stack || null})
    console.log(ex, ex.stack)
  }
})

export default router