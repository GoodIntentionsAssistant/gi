const expect = require('chai').expect;

const Session = girequire('src/Auth/session');

describe('Session', function() {

  it('can add token', () => {
    let session = new Session();
    session.load(123, { name:'foobar' });
    session.add_token(111);

    expect(session.has('tokens.111')).to.equal(true);
    expect(session.has('tokens.222')).to.equal(false);
  });


  it('can load and set, remove and check if data exists', () => {
    let session = new Session();
    session.load(123, { name:'foobar' });
    session.set('occupation', 'bot');

    session.set('level', 'high');
    session.remove('level');

    expect(session.session_id).to.equal(123);

    expect(session.get('name')).to.equal('foobar');
    expect(session.get('occupation')).to.equal('bot');
    expect(session.get('nothing')).to.equal(undefined);

    expect(session.has('name')).to.equal(true);
    expect(session.has('nothing')).to.equal(false);
    expect(session.has('level')).to.equal(false);

    expect(session.get()).to.be.a('Object');
  });


});