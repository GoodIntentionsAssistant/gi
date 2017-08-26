
var Promise = require('promise');
var io = require('socket.io-client');

describe('Intent Auto Tests', function(){

  var app;
  var agent;
  var tests = [];
  var results = [];
  var count = 0;
  var promise = null;
  var resolve = null;

  beforeEach(function(done) {
    app = require('../../src/app');
    app.verbose = false;

    app.load(['Common','Admin','Productivity']);
    
    app.config.response.min_reply_time = 0;
    app.config.response.letter_speed = 0;

    app.on('ready', function() {
      //Setup client
      agent = io.connect('http://localhost:'+app.config.server.port);
      agent.on('connect', function(){
        console.log('Agent connected');
        done();
      });
    });
  });


  function send(count,input) {
    var input = {
      agent: 'DeviTest',
      text: input,
      type: 'message',
      event: 'direct_message',
      channel: null,
      user: 'jasmine-test',
      source: 'direct',
      namespace: 'jasmine'+count
    };
    agent.emit('request',input);

    //Wait for response
    return new Promise(function(resolve){
      agent.on('request_result::jasmine'+count, function(data){
        resolve(data);
      });
    });
  }


  function check_tests() {
    //End of tests
    if(count >= tests.length) {
      resolve();
      return;
    }

    var input = tests[count].test.input;
    var promise = send(count, input);

    console.log('Gathering "'+input+'", '+tests[count].intent);

    promise.then(function(data) {
      results.push({
        test: tests[count],
        data: data
      });

      //Run next test
      count++;
      check_tests();
    });
  }



  it('intent examples', function(done) {
    //Build up list of tests
    for(var intent_name in app.Intents.objects) {
      var intent = app.Intents.get(intent_name);

      if(!intent.tests) {
        continue;
      }

      for(var ii=0; ii<intent.tests.length; ii++) {
        tests.push({
          intent: intent_name,
          test: intent.tests[ii]
        });
      }
    }

    //Create a promise
    promise = new Promise(function(_resolve){
      resolve = _resolve;
    });

    check_tests();

    promise.then(function() {
      //Check all results
      app.shutdown();
      console.log('Checking '+results.length+' results');

      for(var ii=0; ii<results.length; ii++) {
        var expecting = results[ii].test.intent;
        var result = results[ii].data.intent;
        expect(result).toEqual(expecting);
      }

      done();

    });

  }, 10000);  //Timeout, increase this the more checks we need to do


//..
});