import r from 'rethinkdb';
import Promise from 'bluebird'
import rp from 'request-promise'
import cacheManager from 'cache-manager'
import redisStore from 'cache-manager-redis'
import { ENV, PORT, DATADOG_API_KEY, DATADOG_APP_KEY, REDIS_HOST, REDIS_PORT } from '../environment'
import FileSystem from 'fs'
var Entities = require('html-entities').XmlEntities;
var entities = new Entities()

export default class Character {
  constructor(rethinkData){
    this._data = rethinkData;
  }

  static async GetCharacter(characterName, ranking, attribute,showRealAvatar) {
    var characterName = encodeURIComponent(characterName)
    if (redisCache) {
      const cachedCharacter = await redisCache.getAsync(getCacheName(ranking, characterName))
      if (cachedCharacter) {
        console.log(`${getCacheName(ranking, characterName)} cache hit`)
        return cachedCharacter
      }
    }
    console.log(`${getCacheName(ranking, characterName)} cache miss`)

    const options = {
      uri: `http://maplestory.nexon.net/rankings/${ranking}-ranking/${attribute}?pageIndex=1&character_name=${characterName}&search=true`,
    }

    let rankingListing = await retryRequest(options, 5, `Something happened getting rankings for ${characterName}`)

    let searchRegex
    if (ranking !== 'fame') {
      searchRegex = /<tr>[ \r\n\t]*<td>([0-9]*)<\/td>[ \r\n\t]*<td> <img class=\"avatar\"[ \r\n\t]* src=\"([^\"]*)\"><\/td>[ \r\n\t]*<td>(<img src=\"http:\/\/nxcache.nexon.net\/maplestory\/img\/bg\/bg-immigrant.png\"\/><br \/>)*([^<]*)<\/td>[ \r\n\t]*<td><a class=\"([^\"]*)\" href=\"([^\"]*)\" title=\"([^\"]*)\">&nbsp;<\/a><\/td>[ \r\n\t]*<td><img class=\"job\" src=\"([^\"]*)\" alt=\"([^\"]*)\" title=\"[^\"]*\"><\/td>[ \t\r\n]*<td class="level-move">[ \t\r\n]*([0-9]*)*<br \/>[ \r\n\t]*\(([0-9]*)\)[ \r\n\t]*<br \/>[ \r\n\t]*<div class=\"rank-([^\"]*)\">([^<]*)<\/div>/igm
    } else {
      searchRegex = /<tr>[ \r\n\t]*<td>([0-9]*)<\/td>[ \r\n\t]*<td> <img class=\"avatar\"[ \r\n\t]* src=\"([^\"]*)\"><\/td>[ \r\n\t]*<td>(<img src=\"http:\/\/nxcache.nexon.net\/maplestory\/img\/bg\/bg-immigrant.png\"\/><br \/>)*([^<]*)<\/td>[ \r\n\t]*<td><a class=\"([^\"]*)\" href=\"([^\"]*)\" title=\"([^\"]*)\">&nbsp;<\/a><\/td>[ \r\n\t]*<td><img class=\"job\" src=\"([^\"]*)\" alt=\"([^\"]*)\" title=\"[^\"]*\"><\/td>[ \t\r\n]*<td class="level-move">[ \t\r\n]*([0-9]*)*/igm
    }

    var characters = []
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
        name: entities.decode(characterName),
        job: jobName,
        ranking: Number(rank),
        world: world,
        level: Number(level),
        exp: Number(experience),
        rankMovement: Number(rankDistance),
        rankDirection: rankDirection,
        avatar: `/api/character/${characterName}/avatar`,
        avatarPromise: getAvatar(avatarOptions, 1, `Something happened trying to get ${characterName}'s avatar.`),
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
    return characters.find((character) => encodeURIComponent(character.name).toLowerCase() == characterName.toLowerCase())
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

async function retryRequest(rpOptions, retryCount, catchMessage, currentRetryCount) {
  let results

  if (Number.isNaN(currentRetryCount)) currentRetryCount = 0

  if (currentRetryCount >= retryCount) return

  try {
    results = await rp(rpOptions)
  } catch (err) {
    if (catchMessage) console.warn(catchMessage)
    else console.warn(err)
    return retryRequest(rpOptions, retryCount, catchMessage, currentRetryCount + 1)
  }

  return results
}

async function getNoAvatar() {
  const noAvatarData = await FileSystem.readFileAsync('./public/images/no-avatar.png')
  const prefix = 'data:image/png;base64,'
  const buff = new Buffer(noAvatarData, 'binary')
  const noAvatar = prefix + buff.toString('base64')
  return noAvatar
}

async function getAvatar(rpOptions, retryCount, catchMessage) {
  rpOptions.resolveWithFullResponse = true
  rpOptions.encoding = 'binary'
  rpOptions.transform = (body, response, isFullResponse) => {
    const type = response.headers['content-type']
    const prefix = `data:${type};base64,`
    const buff = new Buffer(body, 'binary')
    const result = prefix + buff.toString('base64')
    return result
  }

  var avatarData = await retryRequest(rpOptions, retryCount, catchMessage)

  if (!avatarData) {
    console.warn('No avatar, going with default')
    return await getNoAvatar()
  } else {
    return await avatarData
  }
}