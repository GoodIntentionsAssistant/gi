describe('Auth', function(){
  var Auth = require('../../src/auth');
  var auth;

  beforeEach(function() {
    auth = new Auth();
    auth.initialize();
  });


  it('identify and create new session', function() {
  	var my_ident = 'my-ident';
  	var session = auth.identify(my_ident);

  	//Check idents are OK
  	expect(session.data('ident')).not.toBe(null);
  	expect(session._data.ident).toBe(session.data('ident'));
  	expect(session._data.accounts[my_ident]).not.toBe(null);

  	//No context
  	expect(session.data('context')).toBe(null);

  	//No auth
  	expect(Object.keys(session.data('authorized')).length).toBe(0);
  });


  it('identify and create session then load it back in', function() {
  	var my_ident = 'my-ident';
  	var session1 = auth.identify(my_ident);
  	var session2 = auth.identify(my_ident);

  	//Only one session, make sure a second wasn't created
  	expect(auth.data.length).toEqual(1);
  	expect(session1).toEqual(session2);
  });


  it('identify and create two sessions', function() {
  	var my_ident = 'my-ident';
  	var session1 = auth.identify(my_ident+'1');
  	var session2 = auth.identify(my_ident+'2');

  	//Only one session, make sure a second wasn't created
  	expect(auth.data.length).toEqual(2);
  	expect(session1).not.toEqual(session2);
  });


  it('create session', function() {
    var result = auth.create('ABC');
    expect(result).toEqual(true);
  	expect(auth.data.length).toEqual(1);
  	expect(auth.data[0].ident).not.toEqual(null);
  });


  it('create session with no identifier', function() {
    var result = auth.create();
    expect(result).toEqual(false);
  });


  it('find account by identifier', function() {
    auth.create('abc');
    var result = auth.find_user('abc');
    expect(result).not.toEqual(null);
  });


  it('try to find account which does not exist', function() {
    auth.create('abc');
    var result = auth.find_user('abcef');
    expect(result).toEqual(false);
  });
  

});

