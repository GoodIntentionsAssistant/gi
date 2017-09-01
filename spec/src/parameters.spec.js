describe('Parameters', function(){
  var Parameters = require('../../src/parameters');
  var Entities = require('../../src/entities');
  var Config = require('../../src/config');
  var parameters;
  var entities;

  var fakeApp = new Object();
  fakeApp.log = function() {};
  fakeApp.error = function() {};
  fakeApp.Config = new Config({
    app_dir: __dirname+'/../apps'
  });

  var dummyData = {
    "choice": {
      name: "Choice",
      data: {
        "rock":{},
        "paper":{},
        "scissors":{}
      }
    }
  };

  beforeEach(function() {
    entities = new Entities();
    entities.initialize(fakeApp);

    fakeApp.Entities = entities;
  });


  it('load dummy entity and find rock', function(done) {
    entities.load('Common/Dummy');

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse('i will choose rock', dummyData);

    parameters.promise.then(function() {
      expect(parameters.data.choice.value).toEqual('rock');
      done();
    });
  });


  it('load dummy entity and find paper', function(done) {
    entities.load('Common/Dummy');

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse('i will choose paper', dummyData);

    parameters.promise.then(function() {
      expect(parameters.data.choice.value).toEqual('paper');
      done();
    });
  });


  it('load dummy entity and find scissors', function(done) {
    entities.load('Common/Dummy');

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse('i will choose scissors', dummyData);

    parameters.promise.then(function() {
      expect(parameters.data.choice.value).toEqual('scissors');
      done();
    });
  });


  it('no match with rock paper scissors and not required so it is valid', function(done) {
    entities.load('Common/Dummy');

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse('i will choose nothing', dummyData);

    parameters.promise.then(function() {
      expect(parameters.validates).toEqual(true);
      expect(parameters.data.choice.valid).toEqual(true);
      expect(parameters.data.choice.value).toEqual(null);
      done();
    });
  });


  it('no match with rock paper scissors and not valid', function(done) {
    entities.load('Common/Dummy');

    dummyData.choice.required = true;

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse('i will choose nothing', dummyData);

    parameters.promise.then(function() {
      expect(parameters.validates).toEqual(false);
      expect(parameters.data.choice.valid).toEqual(false);
      done();
    });
  });


  it('check default value is set when not found', function(done) {
    entities.load('Common/Dummy');

    dummyData.choice.default = 'maybe';

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse('i will choose nothing', dummyData);

    parameters.promise.then(function() {
      expect(parameters.data.choice.value).toEqual('maybe');
      expect(parameters.data.choice.valid).toEqual(true);
      done();
    });
  });


  it('parse from intent foobar and find yes', function(done) {
    entities.load('Example/Foobar');

    var fakeIntent = new Object();
    fakeIntent.parameters = {
      "choice": {
        name: "Choice",
        entity: "Example/Foobar",
        required: false
      }
    };

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse_from_intent('yes', fakeIntent);

    parameters.promise.then(function() {
      expect(parameters.data.choice.value).toEqual('yes');
      expect(parameters.data.choice.label).toEqual('Yes');
      done();
    });
  });


  it('parse from intent foobar and find yes', function(done) {
    entities.load('Example/Foobar');

    var fakeIntent = new Object();
    fakeIntent.parameters = {
      "choice": {
        name: "Choice",
        entity: "Example/Foobar",
        required: false
      }
    };

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse_from_intent('yes', fakeIntent);

    parameters.promise.then(function() {
      expect(parameters.data.choice.value).toEqual('yes');
      expect(parameters.data.choice.label).toEqual('Yes');
      done();
    });
  });


  it('parse from intent foobar and find indeed (synonym of yes)', function(done) {
    entities.load('Example/Foobar');

    var fakeIntent = new Object();
    fakeIntent.parameters = {
      "choice": {
        name: "Choice",
        entity: "Example/Foobar",
        required: false
      }
    };

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse_from_intent('indeed', fakeIntent);

    parameters.promise.then(function() {
      expect(parameters.data.choice.value).toEqual('yes');
      done();
    });
  });


  it('parse from intent foobar and find no / nope', function(done) {
    entities.load('Example/Foobar');

    var fakeIntent = new Object();
    fakeIntent.parameters = {
      "choice": {
        name: "Choice",
        entity: "Example/Foobar",
        required: false
      }
    };

    var parameters = new Parameters();
    parameters.initialize(fakeApp);
    parameters.parse_from_intent('nope', fakeIntent);

    parameters.promise.then(function() {
      expect(parameters.data.choice.value).toEqual('no');
      expect(parameters.data.choice.label).toEqual('No');
      done();
    });
  });


});

