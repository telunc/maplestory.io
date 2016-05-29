import r from 'rethinkdb';
import Promise from 'bluebird'

function GetItems(filter){
  return r.db('maplestory').table('items').filter(filter).map(function(item){
    return item('MetaInfo')
      .merge(r.expr({
        id: item('id'),
        description: item('Description')('Description'),
        name: item('Description')('Name')
      }))
      .merge(item('TypeInfo'))
  }).without('HighItemId', 'LowItemId')
}

/**
 * Gets a new RethinkDB connection to run queries against.
 */
function Connect() {
  return r.connect({
    host: process.env.RETHINKDB_HOST,
    port: process.env.RETHINKDB_PORT,
    AUTH: process.env.RETHINKDB_AUTH,
    DB: process.env.RETHINKDB_DB
  })
}

export default class MapleItem {
  constructor(rethinkData){
    this._data = rethinkData
  }

  toJSON(){
    return this._data
  }

  get Icon(){
    return this._data.Icon
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findAll(filter){
    const connection = await Connect()
    console.log('Querying for: ', filter)
    const cursor = await GetItems(filter).run(connection)
    const fullItems = await cursor.toArray()
    console.log('Found items', fullItems.length)
    connection.close()
    console.log('Querying for: ', filter, 'returned:', fullItems.length)
    return fullItems.map(entry => new MapleItem(entry))
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findFirst(filter){
    const connection = await Connect()
    console.log('Querying for: ', filter)
    const cursor = await GetItems(filter).limit(1).run(connection)
    const fullItems = await cursor.toArray()
    connection.close()
    console.log('Querying for: ', filter, 'returned:', fullItems.length)
    return fullItems.map(entry => new MapleItem(entry)).shift()
  }
}