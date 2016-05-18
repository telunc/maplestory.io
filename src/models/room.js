import r from 'rethinkdb';
import Promise from 'bluebird'

var serverNames = [
    'Scania',
    'Windia',
    'Bera',
    'Khroa',
    'MYBCKN',
    'GRAZED'
]

function Connect(){
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

function GetRooms(){
    return r.db('maplefm').table('rooms')
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
    
    static async find(serverId){
        const connection = await Connect()
        const cursor = await GetRooms().filter({server: Number(serverId)}).run(connection)
        const fullItems = await cursor.toArray()
        connection.close()
        return fullItems.map(entry => new Room(entry))
    }
}