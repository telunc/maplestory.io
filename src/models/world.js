import r from 'rethinkdb';
import Promise from 'bluebird'

function GetWorlds(filter){
  return r.db('maplestory').table('worlds').filter(filter || {})
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

export default class World {
  constructor(rethinkData){
    this._data = rethinkData;
  }

  toJSON(){
    return {
      id: this.id,
      icon: this.icon
    }
  }

  get id(){
    return this._data.id
  }

  get icon(){
    return this._data.Icon
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findAll(filter){
    const connection = await Connect()
    const cursor = await GetWorlds(filter).run(connection)
    const fullWorlds = await cursor.toArray()
    connection.close()
    return fullWorlds.map(entry => new World(entry))
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findFirst(filter){
    const connection = await Connect()
    const cursor = await GetWorlds(filter).limit(1).run(connection)
    const fullWorlds = await cursor.toArray()
    connection.close()
    return fullWorlds.map(entry => new World(entry)).shift()
  }
}