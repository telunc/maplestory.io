import r from 'rethinkdb';
import Promise from 'bluebird'

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
    const connection = await Connect()
    data.createdAt = new Date()
    return r.db('maplestory').table('characters').insert(data).run(connection)
  }

  static async replace(id, data) {
    const connection = await Connect()
    data.createdAt = new Date()
    return r.db('maplestory').table('characters').get(id).replace(data).run(connection)
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findFirst(filter){
    const connection = await Connect()
    if (filter instanceof String) {
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