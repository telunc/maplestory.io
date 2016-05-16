var r = require('rethinkdb');

function listenToServer(api, id, name){
  r.connect({
        host: process.env.RETHINKDB_HOST,
        port: process.env.RETHINKDB_PORT,
        AUTH: process.env.RETHINKDB_AUTH,
        DB: process.env.RETHINKDB_DB
  }, function(err, connection){
    r.db('maplefm').table('rooms').filter({server: id}).changes().run(connection, function(err, cursor){
      cursor.each(function(err, entry){
        api.chatRoom.broadcast({room: name}, name, JSON.stringify(entry));
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
    // disconnect from server
    next();
  }
}