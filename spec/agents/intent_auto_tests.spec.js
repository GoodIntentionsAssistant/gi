
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
    
    app.Config.write('response.min_reply_time', 0);
    app.Config.write('response.letter_speed', 0);
    app.Config.write('server.port', 30662);

    app.on('ready', function() {
      //Setup client
      agent = io.connect('http://localhost:'+app.Config.read('server.port'));
      agent.on('connect', function(){
        console.log('Agent connected');
        done();
      });
    });
  });


  function send(count,input) {
    var input = {
      client: 'DeviTest',
      text: input,
      session_token: session_token,
      type: 'message',
      user: 'jasmine-test',
      namespace: 'jasmine'+count
    };
    agent.emit('request',input);

    //Wait for response
    return new Promise(function(resolve){
      agent.on('response::jasmine'+count, function(data){
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
    for(var intent_name in app.IntentRegistry.objects) {
      var intent = app.IntentRegistry.get(intent_name);

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