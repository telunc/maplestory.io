import r from 'rethinkdb'
import Promise from 'bluebird'
import Item from './item'

function GetShops(filter){
  return r.db("maplestory").table('rooms').filter(filter || {}).map(function(room){
    return room('shops').values().limit(1).map(function(shop){
      return {
        server: room('server'),
        id: room('id').add('-').add(shop('id').coerceTo('string')),
        channel: room('channel'),
        createdAt: room('createTime'),
        room: room('room'),
        characterName: shop('characterName'),
        shopName: shop('shopName'),
        items: shop('items').eqJoin('id', r.db('maplestory').table('items')).map(function(item){
          return item('left')
          .merge(item('right')('Description'))
          .merge(item('right')('MetaInfo'))
          .merge(r.branch(item('right')('MetaInfo')('Equip'), r.expr({potentials: r.expr([
              {'PotentialId': item('left')('potential1').coerceTo('number'), target: 'potential1'},
              {'PotentialId': item('left')('potential2').coerceTo('number'), target: 'potential2'},
              {'PotentialId': item('left')('potential3').coerceTo('number'), target: 'potential3'},
              {'PotentialId': item('left')('bpotential1').coerceTo('number'), target: 'bpotential1'},
              {'PotentialId': item('left')('bpotential2').coerceTo('number'), target: 'bpotential2'},
              {'PotentialId': item('left')('bpotential3').coerceTo('number'), target: 'bpotential3'}
          ]).eqJoin('PotentialId', r.db('maplestory').table('potentialLevels'), {index: 'PotentialId'}).zip()
            .filter({Level: r.branch(item('right')('MetaInfo')('Equip')('reqLevel'), item('right')('MetaInfo')('Equip')('reqLevel'), 1).coerceTo('number').add(9).div(10).floor()})
            .eqJoin('PotentialId', r.db('maplestory').table('potentials')).zip().without('Level', 'PotentialId', 'RequiredLevel')}), {}))
        }).without("unk1", "unk2", "unk3", "unk4", "unk5", "unk6", "unk7", "unk8", "WZFile", "WZFolder", "bpotential1Level", "bpotential2Level", "bpotential3Level", "potential1Level", "potential2Level", "potential3Level", 'potential1', 'potential2', 'potential3', 'bpotential1', 'bpotential2', 'bpotential3')
      }
    })
  })
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

export default class Shop {
  constructor(rethinkData){
    this._data = rethinkData;
  }

  toJSON(){
    return {
      server: this.server,
      id: this.id,
      channel: this.channel,
      createdAt: this.createdAt,
      room: this.room,
      characterName: this.characterName,
      shopName: this.shopName,
      items: this.items
    }
  }

  get server(){
    return this._data.server
  }
  get id(){
    return this._data.id
  }
  get channel(){
    return this._data.channel
  }
  get createdAt(){
    return this._data.createdAt
  }
  get room(){
    return this._data.room
  }
  get characterName(){
    return this._data.characterName
  }
  get shopName(){
    return this._data.shopName
  }

  get items(){
    return this._data.items.map(item => new Item(item))
  }

    /**
     * @param {object} filter The rethinkdb compatible filter object to use for the query.
     */
    static async findAll(filter){
        const connection = await Connect()
        const cursor = await GetShops(filter).run(connection)
        const fullItems = await cursor.toArray()
        connection.close()
        console.log('Querying for: ', filter, 'returned:', fullItems.length)
        return fullItems.map(entry => new Item(entry))
    }

    /**
     * @param {object} filter The rethinkdb compatible filter object to use for the query.
     */
    static async findFirst(filter){
        const connection = await Connect()
        const cursor = await GetShops(filter).limit(1).run(connection)
        const fullItems = await cursor.toArray()
        connection.close()
        console.log('Querying for: ', filter, 'returned:', fullItems.length)
        return fullItems.map(entry => new Item(entry)).shift()
    }
}