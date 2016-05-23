import r from 'rethinkdb';
import Promise from 'bluebird'

export default function Connect() {
  return new Promise((resolve, reject) =>{
    console.log('Connect')
    r.connect({
      host: process.env.RETHINKDB_HOST,
      port: process.env.RETHINKDB_PORT,
      AUTH: process.env.RETHINKDB_AUTH,
      DB: process.env.RETHINKDB_DB
    }, (err, connection) =>{
      console.log('Connected')
      if(err) return reject(err)
      resolve(connection)
    })
  })
}