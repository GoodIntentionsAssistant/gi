const expect = require('chai').expect;

const Auth = girequire('src/Auth/auth');

describe('Auth', function() {

  beforeEach(() => {
    //Create a fake instances
    this.FakeApp = new Object();
    this.FakeApp.Event = new Object({
      emit: function() {}
    });

    this.FakeClient = new Object();
  });


  it('find a user id', () => {
    let auth = new Auth(this.FakeApp);

    auth.users = [
      {'user_id': 'foobar1' },
      {'user_id': 'foobar2' }
    ];

    expect(auth.find_user('foobar1')).is.a('Object');
    expect(auth.find_user('foobar2')).is.a('Object');
    expect(auth.find_user('foobar4')).to.equal(false);
  });


  it('find a session id', () => {
    let auth = new Auth(this.FakeApp);

    auth.sessions = [
      {'session_id': 'foobar1' },
      {'session_id': 'foobar2' }
    ];

    expect(auth.find_session('foobar1')).is.a('Object');
    expect(auth.find_session('foobar2')).is.a('Object');
    expect(auth.find_session('foobar4')).to.equal(false);
  });


  it('find a token', () => {
    let auth = new Auth(this.FakeApp);

    auth.sessions = [
      {'tokens': {'foobar1':'1'} },
      {'tokens': {'foobar2':'2'} }
    ];

    expect(auth.find_token('foobar1')).is.a('Object');
    expect(auth.find_token('foobar2')).is.a('Object');
    expect(auth.find_token('foobar4')).to.equal(false);
  });


  it('can validate token', () => {
    let auth = new Auth(this.FakeApp);
    expect(auth.validate_token('')).to.equal(false);
    expect(auth.validate_token('abcdef')).to.equal(true);
  });


  it('can validate session_id', () => {
    let auth = new Auth(this.FakeApp);
    expect(auth.validate_session_id('')).to.equal(false);
    expect(auth.validate_session_id('abcdef')).to.equal(true);
  });


  it('cannot identify because of invalid session_id', () => {
    let auth = new Auth(this.FakeApp);
    let result = auth.identify('');
    expect(result).to.equal(false);
  });


  it('cannot identify the session strict mode is on', () => {
    let auth = new Auth(this.FakeApp);
    auth.strict = true;
    let result = auth.identify('abcdef');
    expect(result).to.equal(false);
  });


  it('cannot identify the session and creates a new session', () => {
    let auth = new Auth(this.FakeApp);
    let result = auth.identify('abcdef');

    expect(result.session).is.a('Object');
    expect(result.user).is.a('Object');
    expect(result.created).to.equal(true);
  });


  it('can identify the session', () => {
    let auth = new Auth(this.FakeApp);
    let data = auth.authenticate('abcde', this.FakeClient);
  
    let result = auth.identify(data.session_id);

    expect(result.session).is.a('Object');
    expect(result.user).is.a('Object');
    expect(result.created).to.equal(false);
  });


  it('will find the same session if the token is used when authenticate', () => {
    let auth = new Auth(this.FakeApp);
    let result1 = auth.authenticate('abcdef');
    let result2 = auth.authenticate('abcdef');
    let result3 = auth.authenticate('foobar'); //Does not exist, session_id will be different

    expect(result1.session_id).to.equal(result2.session_id);
    expect(result1.session_id).to.not.equal(result3.session_id);
  });


  it('will reject auth if token is invalid when authenticate', () => {
    let auth = new Auth(this.FakeApp);
    let result = auth.authenticate('', this.FakeClient);
    expect(result).to.equal(false);
  });


  it('can authenticate with a new token id', () => {
    let auth = new Auth(this.FakeApp);
    let result = auth.authenticate('abcde', this.FakeClient);
  
    expect(result).is.a('Object');
    expect(result.session_id).to.have.lengthOf(16);
    expect(result.user_id).to.have.lengthOf(16);
    expect(result.tokens).to.eql({ abcde: {} });
  });



});