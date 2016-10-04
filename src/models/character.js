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

  async replaceWith(data) {

  }

  save() {
    if (this.fromCache) {
      this.replaceWith(this._data)
    } else {
      Character.insert(this._data)
    }
  }

  static async insert(data) {
    data.createdAt = new Date()
    return r.db('maplestory').table('characters').insert(data).run(connection)
  }

  static async replace(id, data) {
    data.createdAt = new Date()
    return r.db('maplestory').table('characters').get(id).replace(data).run(connection)
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findFirst(filter){
    const connection = await Connect()
    if (filter instanceof string) {
      const entry = await GetCharacter(filter).run(connection)
      if(entry) {
        const character = new Character(entry)
        character.fromCache = true
      }
      return character
    }
    const cursor = await GetCharacters(filter).limit(1).run(connection)
    const fullCharacters = await cursor.toArray()
    connection.close()
    const character = fullCharacters.map(entry => new Character(entry)).shift()
    character.fromCache = true
    return character;
  }

  static async GetCharacter(characterName, ranking, showRealAvatar) {
    const options = {
      uri: `http://maplestory.nexon.net/rankings/${ranking}-ranking/legendary?pageIndex=1&character_name=${characterName}&search=true`,
    };

    let rankingListing

    let tries = 0
    while (!rankingListing && ++tries < 5) {
      try {
        rankingListing = await rp(options)
      } catch(ex) {
        console.warn('Something happened getting rankings: ', rankingListing)
      }
    }

    let searchRegex
    if (ranking !== 'fame') {
      searchRegex = /<tr>[ \r\n\t]*<td>([0-9]*)<\/td>[ \r\n\t]*<td> <img class=\"avatar\"[ \r\n\t]* src=\"([^\"]*)\"><\/td>[ \r\n\t]*<td>(<img src=\"http:\/\/nxcache.nexon.net\/maplestory\/img\/bg\/bg-immigrant.png\"\/><br \/>)*([^<]*)<\/td>[ \r\n\t]*<td><a class=\"([^\"]*)\" href=\"([^\"]*)\" title=\"([^\"]*)\">&nbsp;<\/a><\/td>[ \r\n\t]*<td><img class=\"job\" src=\"([^\"]*)\" alt=\"([^\"]*)\" title=\"[^\"]*\"><\/td>[ \t\r\n]*<td class="level-move">[ \t\r\n]*([0-9]*)*<br \/>[ \r\n\t]*\(([0-9]*)\)[ \r\n\t]*<br \/>[ \r\n\t]*<div class=\"rank-([^\"]*)\">([^<]*)<\/div>/igm
    } else {
      searchRegex = /<tr>[ \r\n\t]*<td>([0-9]*)<\/td>[ \r\n\t]*<td> <img class=\"avatar\"[ \r\n\t]* src=\"([^\"]*)\"><\/td>[ \r\n\t]*<td>(<img src=\"http:\/\/nxcache.nexon.net\/maplestory\/img\/bg\/bg-immigrant.png\"\/><br \/>)*([^<]*)<\/td>[ \r\n\t]*<td><a class=\"([^\"]*)\" href=\"([^\"]*)\" title=\"([^\"]*)\">&nbsp;<\/a><\/td>[ \r\n\t]*<td><img class=\"job\" src=\"([^\"]*)\" alt=\"([^\"]*)\" title=\"[^\"]*\"><\/td>[ \t\r\n]*<td class="level-move">[ \t\r\n]*([0-9]*)*/igm
    }

    let characters = []
    let match

    console.log('Getting', characterName)
    while (match = searchRegex.exec(rankingListing)) {
      console.log(match)
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

      console.log(characterName, '-', level)


      if (REDIS_HOST && REDIS_PORT) {
        redisCache.set(`ranking-${ranking}-${characterName.toLowerCase()}-`, {
          name: characterName,
          job: jobName,
          ranking: rank,
          world: world,
          level: level,
          exp: experience,
          rankMovement: rankDistance,
          rankDirection: rankDirection,
          realAvatar: avatar,
          got: new Date()
        })
      }

      characters.push({
        name: characterName,
        job: jobName,
        ranking: rank,
        world: world,
        level: level,
        exp: experience,
        rankMovement: rankDistance,
        rankDirection: rankDirection,
        avatar: showRealAvatar ? avatar : `/api/character/${characterName}/avatar`,
        got: new Date()
      })
    }

    return characters.find((character) => character.name.toLowerCase() == characterName.toLowerCase())
  }
}

function GetCharacters(filter) {
  return r.db('maplestory').table('characters').filter(r.row['createdAt'].during((new Date(Date.now() - (24 * 60 * 60 * 1000))), new Date(), {leftBound: 'open', rightBound: 'open'})).filter(filter || {})
}

function GetCharacter(name) {
  return r.db('maplestory').table('characters').filter(r.row['createdAt'].during((new Date(Date.now() - (24 * 60 * 60 * 1000))), new Date(), {leftBound: 'open', rightBound: 'open'})).get(name)
}

/**
 * Gets a new RethinkDB connection to run queries against.
 */
function Connect() {
  return r.connect({
    host: process.env.RETHINKDB_HOST,
    port: process.env.RETHINKDB_PORT,
    user: process.env.RETHINKDB_USER,
    password: process.env.RETHINKDB_PASS,
    DB: process.env.RETHINKDB_DB
  })
}