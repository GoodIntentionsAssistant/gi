describe('Entities', function(){
  var Entities = require('../../src/entities');
  var entities;

  var fakeApp = new Object();
  fakeApp.config = {
    app_dir: '../spec/apps'
  };
  fakeApp.log = function() {};
  fakeApp.error = function() {};

  var Promise = require('promise');

  beforeEach(function() {
    fakeApp.config.app_dir = __dirname+'/../apps';

    entities = new Entities();
    entities.initialize(fakeApp);
  });


  it('load foobar example entity', function() {
    var entity = entities.load('Example/Foobar');
    expect(entity.name).toEqual('Foobar');
    expect(Object.keys(entities.objects).length).toEqual(1);
  });


  it('load example entity with no caching', function() {
    var entity = entities.load('Example/Foobar',{
      cache: false
    });
    expect(Object.keys(entities.objects).length).toEqual(0);
  });


  it('load then get the entity', function() {
    entities.load('Example/Foobar');
    var entity = entities.get('Example/Foobar');
    expect(entity.name).toEqual('Foobar');
  });


  it('get entity that does not exist', function() {
    var entity = entities.get('Example/Foobar');
    expect(entity).toEqual(false);
  });


  it('load entity incorrectly', function() {
    var result = entities.load('Foobar');
    expect(result).toEqual(false);
  });


  it('load all with app name', function(done) {
    entities.load_all('Example');

    setTimeout(function() {
      expect(Object.keys(entities.objects).length).toEqual(2);
      done();
    },50);
  });


  it('load entity that requires session but dont pass required request object', function() {
    entities.load('Example/CustomData');
    var result = entities.get('Example/CustomData');
    expect(result).toEqual(false);
  });


  it('load entity that requires session', function() {
    var Auth = require('../../src/auth');
    var Session = require('../../src/session');

    auth = new Auth();
    auth.initialize();
    session = auth.identify('myident');
    session.set_auth('system', {
      'api_token': 'foobar'
    });

    var fakeRequest = new Object();
    fakeRequest.session = session;

    entities.load('Example/CustomData');

    var entity = entities.get('Example/CustomData', fakeRequest);

    //
    expect(entity.name).toEqual('CustomData');

    //CustomData and CustomData with the session ident should be loaded
    expect(Object.keys(entities.objects).length).toEqual(2);

    //Example/CustomData::FSFVDR0MZBZQ-foobar
    var key = Object.keys(entities.objects)[1];
    var expecting = 'Example/CustomData::'+session._data.ident+'-foobar';
    expect(expecting).toEqual(key);
  });

  //......


});

