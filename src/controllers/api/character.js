import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import API from '../../lib/API'
import Character from '../../models/character'
import rp from 'request-promise'
import apicache from 'apicache'
import redis from 'redis'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY, REDIS_HOST, REDIS_PORT } from '../../environment'

const router = express.Router()

let redisClient
if (REDIS_HOST && REDIS_PORT) {
  redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
  })
  console.warn('Character - Redis caching enabled')
} else {
  console.warn('Character - Redis not enabled')
}

const caching = apicache.options({
    debug: ENV.NODE_ENV == 'development',
    defaultDuration: 43200000,
    enabled: true,
    redisClient
  }).middleware

//Try to cache the results for at least 12 hours as CPU is also costly
router.use(caching())

// OVERALL

API.registerCall(
  '/api/character/:characterName',
  'Gets the ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    'name':'SomePerson123',
    'job':'Magician',
    'ranking':1,
    'world':'Khaini',
    'level':255,
    'exp':4339186,
    'rankMovement':1,
    'rankDirection':'up',
    'avatar':'/api/character/SomePerson123/avatar',
    'got':'2016-10-05T04:48:21.537Z',
    'avatarData':'data:image/png;base64,'
  }
)

router.get('/:characterName', async (req, res, next) => {
  try{
    const ranking = 'overall'
    const attribute = 'legendary'
    const characterName = req.params.characterName
    const character = await Character.GetCharacter(characterName, ranking, attribute)
    if (!character) return res.status(404).send({ error: 'Could not find character' })

    res.success(character)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

// WORLD

API.registerCall(
  '/api/character/world/:worldName/:characterName',
  'Gets the ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    'name':'SomePerson123',
    'job':'Magician',
    'ranking':1,
    'world':'Khaini',
    'level':255,
    'exp':4339186,
    'rankMovement':1,
    'rankDirection':'up',
    'avatar':'/api/character/SomePerson123/avatar',
    'got':'2016-10-05T04:48:21.537Z',
    'avatarData':'data:image/png;base64,'
  }
)

router.get('/world/:worldName/:characterName', async (req, res, next) => {
  try{
    const ranking = 'world'
    const attribute = req.params.worldName
    const characterName = req.params.characterName
    const character = await Character.GetCharacter(characterName, ranking, attribute)
    if (!character) return res.status(404).send({ error: 'Could not find character' })

    res.success(character)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

// JOB

API.registerCall(
  '/api/character/job/:jobName/:characterName',
  'Gets the ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    'name':'SomePerson123',
    'job':'Magician',
    'ranking':1,
    'world':'Khaini',
    'level':255,
    'exp':4339186,
    'rankMovement':1,
    'rankDirection':'up',
    'avatar':'/api/character/SomePerson123/avatar',
    'got':'2016-10-05T04:48:21.537Z',
    'avatarData':'data:image/png;base64,'
  }
)

router.get('/job/:jobName/:characterName', async (req, res, next) => {
  try{
    const ranking = 'job'
    var jobName = req.params.jobName
    var catName = req.params.jobName
    if (jobName === 'Dual Blade'){jobName = 'Thief'}
    const explorer = ['Beginner','Warrior','Magician','Bowman','Thief']
    const cygnus = ['Noblesse','Dawn Warrior','Blaze Wizard','Wind Archer','Night Walker','Thunder Breaker']
    const resistance = ['Citizen','Demon Slayer','Battle Mage','Wild Hunter','Mechanic']
    const sengoku = ['Hayato','Kanna']
    if (jobName in explorer){catName='explorer'} 
    else if (jobName in cygnus){catName='cygnus-knights'}
    else if (jobName in resistance){catName='resistance'}
    else if (jobName in sengoku){catName='sengoku'}
    const attribute = catName + '/'+ jobName
    const characterName = req.params.characterName
    const character = await Character.GetCharacter(characterName, ranking, attribute)
    if (!character) return res.status(404).send({ error: 'Could not find character' })

    res.success(character)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

// Fame

API.registerCall(
  '/api/character/:characterName/fame',
  'Gets the fame ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    'name':'SomePerson123',
    'job':'Magician',
    'ranking':1,
    'world':'Khaini',
    'fame':2377,
    'rankMovement':1,
    'rankDirection':'up',
    'avatar':'/api/character/SomePerson123/avatar',
    'got':'2016-10-05T04:48:21.537Z',
    'avatarData':'data:image/png;base64,'
  }
)

router.get('/:characterName/fame', async (req, res, next) => {
  try{
    const characterName = req.params.characterName
    let character = await Character.GetCharacter(characterName, 'fame')
    if (!character) return res.status(404).send({ error: 'Could not find character' })

    character.fame = character.level
    delete character.level
    delete character.exp

    res.success(character)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

// AVATAR

API.registerCall(
  '/api/character/:characterName/avatar',
  'Gets the avatar of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  'Image/PNG'
)

router.get('/:characterName/avatar', async (req, res, next) => {
  const ranking = 'overall'
  const attribute = 'legendary'
  const characterName = req.params.characterName
  const character = await Character.GetCharacter(characterName, ranking, attribute,true)
  if (!character) return res.status(404).send({ error: 'Could not find character' })

  const base64Location = character.avatarData.indexOf('base64,')
  const type = character.avatarData.substr(5, base64Location - 5)
  const avatarData = character.avatarData.substr(base64Location + 7)
  const characterAvatar = new Buffer(avatarData, 'base64')
  res.set('Content-Type', type)
    .send(characterAvatar)
})

export default router