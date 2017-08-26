describe('Session', function(){
  var Auth = require('../../src/auth');
  var Session = require('../../src/session');
  var auth;
  var session;

  beforeEach(function() {
    auth = new Auth();
    auth.initialize();
    session = auth.identify('myident');
  });


  it('set and load data', function() {
    session.set('foo','bar')
    var result = session.data('foo');
    expect(result).toEqual('bar');
  });


  it('not authorized to a source', function() {
    var result = session.authorized('foo');
    expect(result).toEqual(false);
  });


  it('set authorized to a source', function() {
    session.set_auth('foo', true);
    var result = session.authorized('foo');
    expect(result).toEqual(true);
  });


  it('set authorized to a source then remove it', function() {
    session.set_auth('foo', true);
    session.remove_auth('foo');
    var result = session.authorized('foo');
    expect(result).toEqual(false);
  });


  it('get authorization identity', function() {
    session.set_auth('foo', {
      api_token: 'bar'
    });
    var result = session.auth_ident('foo');
    expect(result).toEqual(session._data.ident+'-bar');
  });


  it('get authorization identity that does not exist', function() {
    session.set_auth('foo', {
      api_token: 'bar'
    });
    var result = session.auth_ident('bar');
    expect(result).toEqual(false);
  });


  it('set and check it has expecting', function() {
    session.set_expecting({'foo':'bar'});
    var result = session.has_expecting();
    expect(result).toEqual(true);
  });


  it('check to make sure no expecting is set', function() {
    var result = session.has_expecting();
    expect(result).toEqual(false);
  });


  it('set expecting and check it is valid', function() {
    session.set_expecting({'foo':'bar'});
    var result = session.get_expecting();
    expect(result).toEqual({'foo':'bar'});
  });


  it('set expecting and reset it', function() {
    session.set_expecting({'foo':'bar'});
    session.reset_expecting();

    expect(session.has_expecting()).toEqual(false);
    expect(session.get_expecting()).toEqual(false);
  });


});

