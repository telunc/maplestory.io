import r from 'rethinkdb'
import Promise from 'bluebird'
import Item from './item'

const serverNames = [
  ['scania'],
  ['windia'],
  ['bera'],
  ['khaini', 'broa'],
  ['mardia', 'yellonde', 'bellocan', 'chaos', 'kradia', 'nova'],
  ['galicia', 'renegades', 'arcania', 'zenith', 'elnido', 'demethos']
]

function GetServer(server){
  return r
    .expr({
      itemCount: Item.GetItemCount({ server }),
      worlds: r
        .db('maplestory')
        .table('worlds')
        .getAll(r.args(serverNames[server]))
        .coerceTo('array')
    })
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

export default class Server {
  constructor(rethinkData){
    this._data = rethinkData;
  }

  toJSON(){
    return {
      worlds: this.worlds,
      itemCount: this.itemCount
    }
  }

  get worlds(){
    return this._data.worlds
  }

  get itemCount() {
    return this._data.itemCount
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findServer(serverId){
    const connection = await Connect()
    const cursor = await GetServer(serverId).run(connection)
    const fullWorlds = await cursor
    connection.close()
    return new Server(fullWorlds)
  }
}