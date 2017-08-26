describe('Intents', function(){
  var Intents = require('../../src/intents');
  var intents;

  var fakeApp = new Object();
  fakeApp.config = {
    app_dir: '../spec/apps'
  };
  fakeApp.log = function() {};
  fakeApp.error = function() {};

  var Promise = require('promise');

  beforeEach(function() {
    fakeApp.config.app_dir = __dirname+'/../apps';

    intents = new Intents();
    intents.initialize(fakeApp);
  });


  it('load hello world example intent', function() {
    var intent = intents.load('Domain','Example/HelloWorld');
    expect(intent.name).toEqual('Example/HelloWorld');
    expect(Object.keys(intents.objects).length).toEqual(1);
  });


  it('load then get the intent', function() {
    var intent = intents.load('Domain','Example/HelloWorld');
    var intent = intents.get('Example/HelloWorld');
    expect(intent.name).toEqual('Example/HelloWorld');
  });


  it('get intent that does not exist', function() {
    var intent = intents.get('Example/HelloWorld');
    expect(intent).toEqual(false);
  });


  it('load intent incorrectly with no app name', function() {
    var result = intents.load('Domain','HelloWorld');
    expect(result).toEqual(false);
  });


  it('load intent incorrectly with no name', function() {
    var result = intents.load('Domain');
    expect(result).toEqual(false);
  });


  it('load all intents for example app', function(done) {
    intents.load_all('Example');

    setTimeout(function() {
      expect(Object.keys(intents.objects).length).toEqual(1);
      done();
    },50);
  });

  //..


});

