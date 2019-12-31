const expect = require('chai').expect;

const User = girequire('src/Auth/user');

describe('User', function() {

  it('can check if the data by key exists', () => {
    let user = new User();
    user.load(123, { 'name': 'foobar' });

    expect(user.has('name')).to.equal(true);
    expect(user.has('occupation')).to.equal(false);
  });


  it('can set, remove and get data', () => {
    let user = new User();
    user.load(123, { });
    user.set('name', 'foobar');

    user.set('occupation', 'bot');
    user.remove('occupation');

    expect(user.get('name')).to.equal('foobar');
    expect(user.get('occupation')).to.equal(undefined);
  });


  it('can load and set and fetch data', () => {
    let user = new User();
    user.load(123, { name:'foobar', occupation:'bot' });

    expect(user.get('name')).to.equal('foobar');
    expect(user.get('occupation')).to.equal('bot');
    expect(user.get('nothing')).to.equal(undefined);

    expect(user.get()).to.be.a('Object');
  });


});