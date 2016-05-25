import r from 'rethinkdb';
import Promise from 'bluebird'

/**
 * Internal look up table of server names.
 */
var serverNames = [
  'Scania',
  'Windia',
  'Bera',
  'Khroa',
  'MYBCKN',
  'GRAZED'
]

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

/**
 * Gets a RethinkDB query filtered to the `rooms` table on the `maplefm` db.
 */
function GetRooms(){
  return r.db('maplefm').table('rooms').filter(r.row('room').ge(1))
}

export default class Room {
  constructor(rethinkData){
    this._data = rethinkData;
  }

  get shops(){
    return this._data.shops
  }
  get server(){
    return this._data.server
  }
  get channel(){
    return this._data.channel
  }
  get room(){
    return this._data.room
  }
  get serverName(){
    return serverNames[this._data.server]
  }
  get id(){
    return this._data.id
  }
  get createTime(){
    return this._data.createTime
  }

  toJSON(){
    return {
      shops: this.shops,
      server: this.server,
      channel: this.channel,
      room: this.room,
      serverName: this.serverName,
      id: this.id,
      createTime: this.createTime
    }
  }

    /**
     * @param {object} filter The rethinkdb compatible filter object to use for the query.
     */
    static async findAll(filter){
        const connection = await Connect()
        const cursor = await GetRooms().filter(filter).run(connection)
        const fullItems = await cursor.toArray()
        connection.close()
        console.log('Querying for: ', filter, 'returned:', fullItems.length)
        return fullItems.map(entry => new Room(entry))
    }

    /**
     * @param {object} filter The rethinkdb compatible filter object to use for the query.
     */
    static async findFirst(filter){
        const connection = await Connect()
        const cursor = await GetRooms().filter(filter).limit(1).run(connection)
        const fullItems = await cursor.toArray()
        connection.close()
        console.log('Querying for: ', filter, 'returned:', fullItems.length)
        return fullItems.map(entry => new Room(entry)).shift()
    }

    /**
     * Gets the shop and item data in an entire server.
     * @param {number} serverId The server id to find all of the current rooms for.
     */
    static async findRooms(serverId){
        if(!serverId || serverId < 0 || serverId > 5) throw "Needs a valid Server Id (0-5)"
        return Room.findAll({server: Number(serverId)})
    }

    /**
     * Gets the shop and item data in a given server id, channel id, and room id.
     * @param {number} serverId The server id to find the room in. (0-5)
     * @param {number} channelId The channel we should filter to. (1-20)
     * @param {number} roomId The room number to search for. (0-21)
     */
    static async findRoom(serverId, channelId, roomId){
        if(!serverId || serverId < 0 || serverId > 5) throw "Needs a valid Server Id (0-5)"
        if(!channelId || channelId < 1 || channelId > 20) throw "Needs a valid Channel Id (1-20)"
        if(!roomId || roomId < 0 || roomId > 21) throw "Needs a valid Room Id (0-21)"
        return Room.findFirst({server: Number(serverId), channel: Number(channelId), room: Number(roomId)})
    }
}