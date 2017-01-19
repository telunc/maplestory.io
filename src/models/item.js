import r from 'rethinkdb';
import Promise from 'bluebird'

function GetItemCount(filter) {
  return r.db('maplestory').table('rooms').filter(filter || {}).concatMap(function(room){
    return room('shops').values().concatMap(function(shop){
      return shop('items')
        .merge({
          server: room('server'),
          shopId: room('id').add('-').add(shop('id').coerceTo('string')),
          channel: room('channel'),
          createdAt: room('createTime'),
          room: room('room'),
          characterName: shop('characterName'),
          shopName: shop('shopName'),
        })
    })
  }).eqJoin('id', r.db('maplestory').table('items')).count()
}

function GetItems(filter){
  return r.db('maplestory').table('rooms').filter(filter || {}).concatMap(function(room){
    return room('shops').values().concatMap(function(shop){
      return shop('items')
        .merge({
          server: room('server'),
          shopId: room('id').add('-').add(shop('id').coerceTo('string')),
          channel: room('channel'),
          createdAt: room('createTime'),
          room: room('room'),
          characterName: shop('characterName'),
          shopName: shop('shopName'),
        })
    })
  }).eqJoin('id', r.db('maplestory').table('items')).map(function(item){
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
                .filter({Level: r.branch(item('right')('MetaInfo')('Equip')('reqLevel'), item('right')('MetaInfo')('Equip')('reqLevel'), 1).coerceTo('number').add(9).div(10).floor()})
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

export default class Item {
  constructor(rethinkData){
    this._data = rethinkData;

    if(this.potentials) {
      this.potentials.forEach((potential) => {
        potential.line = potential.Message
        potential.Modifiers.forEach(modifier => {
          potential.line = potential.line.replace(`#${modifier.Item1}`, modifier.Item2)
        })

        this[potential.target] = potential
      })
    }
  }

  toJSON(){
    return {
      card: this.card,
      cash: this.cash,
      equip: this.equip,
      icon: this.icon,
      shop: this.shop,
      chair: this.chair,
      description: this.description,
      itemId: this.itemId,
      name: this.name,
      slot: this.slot,
      acc: this.acc,
      avoid: this.avoid,
      battleModeAtt: this.battleModeAtt,
      bossDmg: this.bossDmg,
      bundle: this.bundle,
      category: this.category,
      channel: this.channel,
      characterName: this.characterName,
      createdAt: this.createdAt,
      creator: this.creator,
      dex: this.dex,
      diligence: this.diligence,
      durability: this.durability,
      expireTime: this.expireTime,
      growth: this.growth,
      hammerApplied: this.hammerApplied,
      ignoreDef: this.ignoreDef,
      intelligence: this.intelligence,
      isIdentified: this.isIdentified,
      jump: this.jump,
      luk: this.luk,
      matk: this.matk,
      mdef: this.mdef,
      mhp: this.mhp,
      mmp: this.mmp,
      nebulite: this.nebulite,
      numberOfEnhancements: this.numberOfEnhancements,
      numberOfPlusses: this.numberOfPlusses,
      only: this.only,
      potentials: this.potentials,
      price: this.price,
      quantity: this.quantity,
      rarity: this.rarity,
      room: this.room,
      server: this.server,
      shopId: this.shopId,
      shopName: this.shopName,
      speed: this.speed,
      str: this.str,
      untradeable: this.untradeable,
      upgradesAvailable: this.upgradesAvailable,
      watk: this.watk,
      wdef: this.wdef,
      id: this.Id
    }
  }

  get card(){
    return this._data.Card
  }

  get cash(){
    return this._data.Cash
  }

  get isCash() {
    return ((this._data.Cash && this._data.Cash.cash) ? 1 : 0)
  }

  get equip(){
    return this._data.Equip
  }

  get icon(){
    return {
      icon: '/api/maplestory/item/' + this.itemId + '/icon',
      iconRaw: '/api/maplestory/item/' + this.itemId + '/iconRaw'
    }
  }

  get shop(){
    return this._data.Shop
  }

  get chair(){
    return this._data.Chair
  }

  get description(){
    return this._data.Description
  }

  get itemId(){
    return this._data.Id
  }

  get name(){
    return this._data.Name
  }

  get slot(){
    return this._data.Slot
  }

  get acc(){
    return this._data.acc
  }

  get avoid(){
    return this._data.avoid
  }

  get battleModeAtt(){
    return this._data.battleModeAtt
  }

  get bossDmg(){
    return this._data.bossDmg
  }

  get bundle(){
    return this._data.bundle
  }

  get category(){
    return this._data.Category
  }

  get overallCategory(){
    return this._data.OverallCategory
  }

  get subCategory(){
    return this._data.SubCategory
  }

  get channel(){
    return this._data.channel
  }

  get characterName(){
    return this._data.characterName
  }

  get createdAt(){
    return this._data.createdAt
  }

  get creator(){
    return this._data.creator
  }

  get dex(){
    return this._data.dex
  }

  get diligence(){
    return this._data.diligence
  }

  get durability(){
    return this._data.durability
  }

  get expireTime(){
    return this._data.expireTime
  }

  get growth(){
    return this._data.growth
  }

  get hammerApplied(){
    return this._data.hammerApplied
  }

  get ignoreDef(){
    return this._data.ignoreDef
  }

  get intelligence(){
    return this._data.intelligence
  }

  get isIdentified(){
    return this._data.isIdentified
  }

  get jump(){
    return this._data.jump
  }

  get luk(){
    return this._data.luk
  }

  get matk(){
    return this._data.matk
  }

  get mdef(){
    return this._data.mdef
  }

  get mhp(){
    return this._data.mhp
  }

  get mmp(){
    return this._data.mmp
  }

  get nebulite(){
    return this._data.nebulite
  }

  get numberOfEnhancements(){
    return this._data.numberOfEnhancements
  }

  get numberOfPlusses(){
    return this._data.numberOfPlusses
  }

  get only(){
    return this._data.only
  }

  get potentials(){
    return this._data.potentialLines
  }

  get price(){
    return this._data.price
  }

  get quantity(){
    return this._data.quantity
  }

  get rarity(){
    return this._data.rarity
  }

  get room(){
    return this._data.room
  }

  get server(){
    return this._data.server
  }

  get shopId(){
    return this._data.shopId
  }

  get shopName(){
    return this._data.shopName
  }

  get speed(){
    return this._data.speed
  }

  get str(){
    return this._data.str
  }

  get untradeable(){
    return this._data.untradeable
  }

  get upgradesAvailable(){
    return this._data.upgradesAvailable
  }

  get watk(){
    return this._data.watk
  }

  get wdef(){
    return this._data.wdef
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findAll(filter){
    const connection = await Connect()
    const cursor = await GetItems(filter).run(connection)
    const fullItems = await cursor.toArray()
    connection.close()
    return fullItems.map(entry => new Item(entry))
  }

  /**
   * @param {object} filter The rethinkdb compatible filter object to use for the query.
   */
  static async findFirst(filter){
    const connection = await Connect()
    const cursor = await GetItems(filter).limit(1).run(connection)
    const fullItems = await cursor.toArray()
    connection.close()
    return fullItems.map(entry => new Item(entry)).shift()
  }

  static async getCount(filter) {
    console.log('Getting item count')
    const connection = await Connect()
    const cursor = await GetItemCount(filter).run(connection)
    connection.close();
    console.log(cursor);
    return cursor;
  }

  static GetItemCount(filter) {
    return GetItemCount(filter)
  }
}