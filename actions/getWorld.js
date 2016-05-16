'use strict';

var r = require('rethinkdb');
var _ = require('lodash');

exports.action = {
  name:                   'getWorld',
  description:            'getWorld',
  blockedConnectionTypes: [],
  outputExample:          [
    {
      "shops": {},
      "server": 4,
      "channel": 1,
      "room": 12,
      "serverName": "Khroa",
      "id": "ROOM-GLOBAL-4-1-12",
      "createTime": "2016-05-16T10:42:34.146Z"
    }
  ],
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {
    'id': {required: true}
  },

  run: function(api, data, next) {
    let error = null;
    r.connect({
        host: process.env.RETHINKDB_HOST,
        port: process.env.RETHINKDB_PORT,
        AUTH: process.env.RETHINKDB_AUTH,
        DB: process.env.RETHINKDB_DB
    }, function(err, connection){
      r.db('maplefm').table('rooms').filter({server: Number(data.params.id)}).run(connection, function(err, cursor){
        cursor.toArray(function(err, fullItems){
          data.response = _.map(fullItems, function(entry){
            return {
              shops: entry.shops,
              server: entry.server,
              channel: entry.channel,
              room: entry.room,
              serverName: "Khroa",
              id: entry.id,
              createTime: entry.createTime
            };
          });
          
          connection.close();
          next(error);
        });
      });
    })
  }
};
