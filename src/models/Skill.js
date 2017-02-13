import r from 'rethinkdb';
import Promise from 'bluebird'

function GetItems(filter){
  return r.db('maplestory').table('skills')
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
  constructor(rethinkData) {
    this._data = rethinkData
  }

  toJSON() {
    return {
      icon: this.icon,
      name: this.job.name
    }
  }
}