import r from 'rethinkdb';
import Promise from 'bluebird'
import ServerNames from '../lib/ServerNames'
import Shop from './shop'

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

/**
 * Gets a RethinkDB query filtered to the `rooms` table on the `maplefm` db.
 */
function GetRooms(filter){
  return r.db('maplestory').table('rooms').filter(filter || {}).map(function(room){
    return {
      server: room('server'),
      id: room('id'),
      channel: room('channel'),
      createdAt: room('createTime'),
      room: room('room'),
      shops: room('shops').values().map(function(shop){
        return {
          characterName: shop('characterName'),
          shopName: shop('shopName'),
          items: shop('items').eqJoin('id', r.db('maplestory').table('items')).map(function(item){
            return item('left')
              .merge(item('right')('Description'))
              .merge(r.branch(item('right')('TypeInfo'), item('right')('TypeInfo'), {'Category': 'Unknown', 'OverallCategory': 'Unknown', 'SubCategory': 'Unknown'}))
              .merge(item('right')('MetaInfo').without('Icon'))
              .merge(
                r.branch(
                  item('right')('MetaInfo')('Equip'),
                  r.expr({
                    potentialLines: r.branch(item('left')('potentials'),
                      r.db('maplestory').table('potentialLevels').getAll(r.args(item('left')('potentials')), {index: 'PotentialId'})
                        .eqJoin('PotentialId', r.db('maplestory').table('potentials'))
                        .zip()
                        .without('Level', 'PotentialId', 'RequiredLevel')
                        .coerceTo('array'),
                      r.expr([])
                    )
                  }), {}
                )
              ).without('unk1', 'unk2', 'unk3', 'unk4', 'unk5', 'unk6', 'unk7', 'unk8', 'WZFile', 'WZFolder', 'bpotential1Level', 'bpotential2Level', 'bpotential3Level', 'potential1Level', 'potential2Level', 'potential3Level', 'potential1', 'potential2', 'potential3', 'bpotential1', 'bpotential2', 'bpotential3')
          })
        }
      })
    }
  })
}

export default class Room {
  constructor(rethinkData){
    this._data = rethinkData;
  }

  get createdAt() {
    return this._data.createdAt.getTime()
  }
  get shops(){
    return this._data.shops.map(shop => new Shop(shop))
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
    return ServerNames[this._data.server]
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
        const cursor = await GetRooms(filter).run(connection)
        const fullItems = await cursor.toArray()
        connection.close()
        return fullItems.map(entry => new Room(entry))
    }

    /**
     * @param {object} filter The rethinkdb compatible filter object to use for the query.
     */
    static async findFirst(filter){
        const connection = await Connect()
        const cursor = await GetRooms(filter).limit(1).run(connection)
        const fullItems = await cursor.toArray()
        connection.close()
        return fullItems.map(entry => new Room(entry)).shift()
    }

    /**
     * Gets the shop and item data in an entire server.
     * @param {number} serverId The server id to find all of the current rooms for.
     */
    static async findRooms(serverId){
        if((serverId != 0 && !serverId) || serverId < 0 || serverId > 5) throw 'Needs a valid Server Id (0-5)'
        return Room.findAll({server: Number(serverId)})
    }

    /**
     * Gets the shop and item data in a given server id, channel id, and room id.
     * @param {number} serverId The server id to find the room in. (0-5)
     * @param {number} channelId The channel we should filter to. (1-20)
     * @param {number} roomId The room number to search for. (0-21)
     */
    static async findRoom(serverId, channelId, roomId){
      console.log('Server Id', serverId)
        if((serverId != 0 && !serverId) || serverId < 0 || serverId > 5) throw 'Needs a valid Server Id (0-5)'
        if((channelId != 0 && !channelId) || channelId < 1 || channelId > 20) throw 'Needs a valid Channel Id (1-20)'
        if((roomId != 0 && !roomId) || roomId < 0 || roomId > 21) throw 'Needs a valid Room Id (0-21)'
        return Room.findFirst({server: Number(serverId), channel: Number(channelId), room: Number(roomId)})
    }
}