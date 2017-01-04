import r from 'rethinkdb';
import Promise from 'bluebird'
import rp from 'request-promise'
import cacheManager from 'cache-manager'
import redisStore from 'cache-manager-redis'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY, REDIS_HOST, REDIS_PORT } from '../environment'

export default class Character {
  constructor(rethinkData){
    this._data = rethinkData;
  }

  static async GetCharacter(characterName, ranking, showRealAvatar) {
    console.log(characterName)
    if (redisCache) {
      const cachedCharacter = await redisCache.getAsync(getCacheName(ranking, characterName))
      if (cachedCharacter) {
        console.log(`${getCacheName(ranking, characterName)} cache hit`)
        return cachedCharacter
      }
    }
    console.log(`${getCacheName(ranking, characterName)} cache miss`)

    const options = {
      uri: `http://maplestory.nexon.net/rankings/${ranking}-ranking/legendary?pageIndex=1&character_name=${characterName}&search=true`,
    }

    let rankingListing = await retryRequest(options, 5, `Something happened getting rankings for ${characterName}`)

    let searchRegex
    if (ranking !== 'fame') {
      searchRegex = /<tr>[ \r\n\t]*<td>([0-9]*)<\/td>[ \r\n\t]*<td> <img class=\"avatar\"[ \r\n\t]* src=\"([^\"]*)\"><\/td>[ \r\n\t]*<td>(<img src=\"http:\/\/nxcache.nexon.net\/maplestory\/img\/bg\/bg-immigrant.png\"\/><br \/>)*([^<]*)<\/td>[ \r\n\t]*<td><a class=\"([^\"]*)\" href=\"([^\"]*)\" title=\"([^\"]*)\">&nbsp;<\/a><\/td>[ \r\n\t]*<td><img class=\"job\" src=\"([^\"]*)\" alt=\"([^\"]*)\" title=\"[^\"]*\"><\/td>[ \t\r\n]*<td class="level-move">[ \t\r\n]*([0-9]*)*<br \/>[ \r\n\t]*\(([0-9]*)\)[ \r\n\t]*<br \/>[ \r\n\t]*<div class=\"rank-([^\"]*)\">([^<]*)<\/div>/igm
    } else {
      searchRegex = /<tr>[ \r\n\t]*<td>([0-9]*)<\/td>[ \r\n\t]*<td> <img class=\"avatar\"[ \r\n\t]* src=\"([^\"]*)\"><\/td>[ \r\n\t]*<td>(<img src=\"http:\/\/nxcache.nexon.net\/maplestory\/img\/bg\/bg-immigrant.png\"\/><br \/>)*([^<]*)<\/td>[ \r\n\t]*<td><a class=\"([^\"]*)\" href=\"([^\"]*)\" title=\"([^\"]*)\">&nbsp;<\/a><\/td>[ \r\n\t]*<td><img class=\"job\" src=\"([^\"]*)\" alt=\"([^\"]*)\" title=\"[^\"]*\"><\/td>[ \t\r\n]*<td class="level-move">[ \t\r\n]*([0-9]*)*/igm
    }

    let characters = []
    let match

    while (match = searchRegex.exec(rankingListing)) {
      const [
        ,
        rank,
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

      const avatarOptions = {
        uri: avatar,
      }

      characters.push({
        name: characterName,
        job: jobName,
        ranking: Number(rank),
        world: world,
        level: Number(level),
        exp: Number(experience),
        rankMovement: Number(rankDistance),
        rankDirection: rankDirection,
        avatar: `/api/character/${characterName}/avatar`,
        avatarPromise: getAvatar(avatarOptions, 2, `Something happened trying to get ${characterName}'s avatar.`),
        got: new Date()
      })
    }

    const avatars = await Promise.all(characters.map(character => character.avatarPromise))
    avatars.forEach((characterAvatar, index) => {
      delete characters[index].avatarPromise
      characters[index].avatarData = characterAvatar
    })

    if (redisCache) {
      await Promise.all(characters.map(character => {
        return redisCache.set(getCacheName(ranking, character.name), character)
      }))
    }

    return characters.find((character) => character.name.toLowerCase() == characterName.toLowerCase())
  }
}

let redisCache
if (REDIS_HOST && REDIS_PORT) {
  redisCache = cacheManager.caching({
    store: redisStore,
    host: REDIS_HOST,
    port: REDIS_PORT,
    db: 0,
    ttl: 600,
    promiseDependency: Promise
  })

  Promise.promisifyAll(redisCache)

  redisCache.store.events.on('redisError', function(error) {
      // handle error here
      console.log(error);
  });
}

function getCacheName(ranking, characterName) {
  return `ranking-${ranking}-${characterName.toLowerCase()}`
}

async function retryRequest(rpOptions, retryCount, catchMessage) {
  let results
  let tries = 0

  while (!results && ++tries < retryCount) {
    try {
      results = await rp(rpOptions) // eslint-disable-line babel/no-await-in-loop
    } catch (err) {
      if (catchMessage) console.warn(catchMessage)
      else console.warn(err)
    }
  }

  return results
}

async function getAvatar(rpOptions, retryCount, catchMessage)
 {
  rpOptions.resolveWithFullResponse = true
  rpOptions.encoding = 'binary'
  rpOptions.transform = (body, response, isFullResponse) => {
    const type = response.headers['content-type']
    const prefix = `data:${type};base64,`
    const buff = new Buffer(body, 'binary')
    const result = prefix + buff.toString('base64')
    return result
  }

  return await retryRequest(rpOptions, retryCount, catchMessage)
}