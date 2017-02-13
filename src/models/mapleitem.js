import r from 'rethinkdb';
import Promise from 'bluebird'

function GetItemList(filter) {
  return r.db('maplestory').table('items').filter(filter || {}).map(function (item) {
    return {id: item('Description')('Id'), name: item('Description')('Name')}
  })
}

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

function GetItem(id){
  return r.db('maplestory').table('items').getAll(id).map((item) => {
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
    user: process.env.RETHINKDB_USER,
    password: process.env.RETHINKDB_PASS,
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
    const cursor = await GetItems(filter).run(connection)
    const fullItems = await cursor.toArray()
    connection.close()
    return fullItems.map(entry => new MapleItem(entry))
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findFirst(filter){
    const connection = await Connect()
    const cursor = await GetItems(filter).limit(1).run(connection)
    const fullItems = await cursor.toArray()
    connection.close()
    return fullItems.map(entry => new MapleItem(entry)).shift()
  }

  /**
   * @param {Number} itemId The ID to look the item up with.
   */
  static async getFirst(itemId){
    const connection = await Connect()
    const cursor = await GetItem(itemId).limit(1).run(connection)
    const fullItems = await cursor.toArray()
    connection.close()
    return fullItems.map(entry => new MapleItem(entry)).shift()
  }

  static async getList(includeHair) {
    const connection = await Connect()

    var filter = function (item) { return item('Description').and(item('id').lt(20000).or(item('id').gt(43000))) }
    if (includeHair) {
      filter = {}
    }

    const cursor = await GetItemList(filter).run(connection)
    const fullItems = await cursor.toArray()
    connection.close()
    return fullItems
  }
}