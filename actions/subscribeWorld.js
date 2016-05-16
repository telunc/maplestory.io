'use strict';

exports.action = {
  name:                   'subscribeWorld',
  description:            'subscribeWorld',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,
  middleware:             [],

  inputs: {},

  run: function(api, data, next) {
    let error = null; 
    
    console.log("attempting to join room");
    api.chatRoom.addMember(data.connection, "khroa", function(){
      console.log("Joined Room");
    });
    
    next(error);
    
    // data = {
    //   connection: {},
    //   action: 'randomNumber',
    //   toProcess: true,
    //   toRender: true,
    //   messageCount: 1,
    //   params: { action: 'randomNumber', apiVersion: 1 },
    //   missingParams: [],
    //   validatorErrors: [],
    //   actionStartTime: 1429531553417,
    //   actionTemplate: {}, // the actual object action definition
    //   working: true,
    //   response: {},
    //   duration: null,
    //   actionStatus: null,
    // }
  }
};
