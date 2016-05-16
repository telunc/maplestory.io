var r = require('rethinkdb');

var singletonConnections = [];

function listenToServer(api, id, name){
  r.connect({
        host: process.env.RETHINKDB_HOST,
        port: process.env.RETHINKDB_PORT,
        AUTH: process.env.RETHINKDB_AUTH,
        DB: process.env.RETHINKDB_DB
  }, function(err, connection){
    singletonConnections.push(connection);
    r.db('maplefm').table('rooms').filter({server: id}).changes().run(connection, function(err, cursor){
      cursor.each(function(err, entry){
        if(entry.new_val){
          var broadcasting = {
            shops: entry.new_val.shops,
            server: entry.new_val.server,
            channel: entry.new_val.channel,
            room: entry.new_val.room,
            serverName: name,
            id: entry.new_val.id,
            createTime: entry.new_val.createTime
          }
          api.chatRoom.broadcast({room: name}, name, JSON.stringify(broadcasting));
        }else{
          console.error('Not sure why this doesn\'t have a new_val:', entry);
        }
      });
    });
  });
}

module.exports = {
  loadPriority:  1000,
  startPriority: 1000,
  stopPriority:  1000,
  initialize: function(api, next){
    next();
  },
  start: function(api, next){
    var serverNames = [
      'Scania',
      'Windia',
      'Bera',
      'Khroa',
      'MYBCKN',
      'GRAZED'
    ]
      
    for(var i = 0; i < 6; ++i){
      console.log('Listening to ' + serverNames[i]);
      listenToServer(api, i, serverNames[i]);
    }

    next();
  },
  
  stop: function(api, next){
    console.log('stop');
    for(var index in singletonConnections){
      singletonConnections[index].close();
    }
    // disconnect from server
    next();
  }
}