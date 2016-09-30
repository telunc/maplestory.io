import express from 'express';
import r from 'rethinkdb'
import Promise from 'bluebird'
import API from '../../lib/API'
import rp from 'request-promise'
import Character from '../../models/character'
import cacheManager from 'cache-manager'
import redisStore from 'cache-manager-redis'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY, REDIS_HOST, REDIS_PORT } from '../../environment'

const router = express.Router()
const redisCache = cacheManager.caching({
  store: redisStore,
  host: REDIS_HOST,
  port: REDIS_PORT,
  db: 0,
  ttl: 600
})

redisCache.store.events.on('redisError', function(error) {
    // handle error here
    console.log(error);
});

API.registerCall(
  '/api/character/:characterName',
  'Gets the ranking information of a character',
  API.createParameter(':characterName', 'string', 'The name of the player to look up'),
  {
    "id":"SomePerson123",
    "job":"Magician",
    "ranking":"1",
    "world":"Khaini",
    "level":255,
    "exp":4339186,
    "rankMovement":1,
    "rankDirection":"up",
    "avatar":"/api/character/SomePerson123/avatar"
  }
)

router.get('/:characterName', async (req, res, next) => {
  try{
    const ranking = 'overall'
    const characterName = req.params.characterName
    const options = {
      uri: `http://maplestory.nexon.net/rankings/${ranking}-ranking/legendary?pageIndex=1&character_name=${characterName}&search=true`,
    };

    let rankingListing

    let tries = 0
    while (!(rankingListing = await rp(options)) && ++tries < 5);

    const searchRegex = /<tr>[ \r\n\t]*<td>[0-9]*<\/td>[ \r\n\t]*<td> <img class=\"avatar\"[ \r\n\t]* src=\"([^\"]*)\"><\/td>[ \r\n\t]*<td>(<img src=\"http:\/\/nxcache.nexon.net\/maplestory\/img\/bg\/bg-immigrant.png\"\/><br \/>)*([^<]*)<\/td>[ \r\n\t]*<td><a class=\"([^\"]*)\" href=\"([^\"]*)\" title=\"([^\"]*)\">&nbsp;<\/a><\/td>[ \r\n\t]*<td><img class=\"job\" src=\"([^\"]*)\" alt=\"([^\"]*)\" title=\"[^\"]*\"><\/td>[ \t\r\n]*<td class="level-move">[ \t\r\n]*([0-9]*)<br \/>[ \r\n\t]*\(([0-9]*)\)[ \r\n\t]*<br \/>[ \r\n\t]*<div class=\"rank-([^\"]*)\">([^<]*)<\/div>*/igm

    let characters = []
    let match

    while (match = searchRegex.exec(rankingListing)) {
      const [
        ,
        avatar,
        ,
        characterName,
        ,
        ,
        world,
        jobIcon,
        jobName,
        level,
        experience,
        rankDirection,
        rankDistance
      ] = match

      redisCache.set(`ranking-${ranking}-${characterName.toLowerCase()}-`, {
        name: characterName,
        job: jobName,
        ranking: level,
        world: world,
        exp: experience,
        rankMovement: rankDistance,
        rankDirection: rankDirection,
        realAvatar: avatar,
        got: new Date()
      })

      characters.push({
        name: characterName,
        job: jobName,
        ranking: level,
        world: world,
        exp: experience,
        rankMovement: rankDistance,
        rankDirection: rankDirection,
        avatar: `/api/character/${characterName}/avatar`,
        got: new Date()
      })
    }

    const characterFound = characters.find((character) => character.name.toLowerCase() == characterName.toLowerCase())

    res.send(characterFound)
  }catch(ex){
    res.status(500).send({error: ex.message || ex, trace: ex.trace || null})
    console.log(ex, ex.stack)
  }
})

export default router