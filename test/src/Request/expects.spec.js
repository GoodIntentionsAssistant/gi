
const expect = require('chai').expect;
const moment = require('moment');

const Expects = girequire('src/Request/expects');
const EntityRegistry = girequire('src/Entity/entity_registry');

describe.only('Expects', function() {

  beforeEach(() => {
    this.FakeRequest = new Object();
    this.FakeRequest.intent = {
      identifier: 'Foobar'
    };
    this.FakeRequest.session = {
      data: {
        foo:'bar'
      },
      set: function(key, data) {
        this.data = data;
      },
      get: function(key) {
        return this.data;
      },
      has: function(key) {
        return this.data ? true : false;
      },
      remove: function(key) {
        return delete(this.data);
      }
    };
    this.FakeRequest.attachment = function(attachment) {
      this.attachment = attachment;
    }

    this.FakeApp = new Object();
    this.FakeApp.Understand = {
      process: function(utterance, collections) {
        return {
          success: false
        }
      }
    };
    this.FakeApp.EntityRegistry = new EntityRegistry(this.FakeApp);

    this.FakeRequest.app = this.FakeApp;

  });



  it('can set the intent action', () => {
    let expects = new Expects(this.FakeRequest);
    let result = expects._set_intent_action('foobar');
    expect(expects.request.action).to.equal('foobar');
    expect(result).to.equal(true);
  });


  it('can store data in a fake user object when using keep', () => {
    this.FakeRequest.user = {
      set: function(key, val) {
        this.key = key;
        this.val = val;
      }
    };
    let expects = new Expects(this.FakeRequest);
    expects._keep('foo', 'bar');
    
    expect(this.FakeRequest.user.key).to.equal('foo');
    expect(this.FakeRequest.user.val).to.equal('bar');
  });


  it('throws an error if the entity requested is not found', () => {
    let expects = new Expects(this.FakeRequest);
    expects.expecting = {
      entity: 'Sys.Entity.Foobar'
    };
    expect(() => { expects.get_entity(); }).to.throw(Error);
  });


  it('will load a fake entity when entity is passed', () => {
    this.FakeApp.EntityRegistry.objects['Sys.Entity.Foobar'] = {
      foo:'bar'
    };

    let expects = new Expects(this.FakeRequest);
    expects.expecting = {
      entity: 'Sys.Entity.Foobar'
    };

    let entity = expects.get_entity();

    expect(entity instanceof Object).to.equal(true);
    expect(entity.foo).to.equal('bar');
  });


  it('will create a dummy entity when data is passed', () => {
    let expects = new Expects(this.FakeRequest);
    expects.expecting = {
      data: {
        "one": {},
        "two": {}
      }
    };

    let entity = expects.get_entity();
    let entity_data = entity.get_data();

    expect(entity instanceof Object).to.equal(true);
    expect(entity_data).to.eql({ one:{}, two:{} });
  });


  it('will return false when trying to get the entity but no data or entity passed', () => {
    let expects = new Expects(this.FakeRequest);
    expects.expecting = {};

    let result = expects.get_entity();
    expect(result).to.equal(false);
  });


  it('throws error when trying to get entity but expects was not set', () => {
    let expects = new Expects(this.FakeRequest);
    expect(() => { expects.get_entity(); }).to.throw(Error);
  });


  it('can expect a reply with attachment', () => {
    let expects = new Expects(this.FakeRequest);
    let result = expects.set({
      
    });
    
    expect(result).to.equal(true);
    expect(this.FakeRequest.session.data.expire).to.equal(60);
    expect(this.FakeRequest.session.data.intent).to.equal('Foobar');
    expect(this.FakeRequest.session.data.expire_at).to.not.equal(null);
  });


  it('check expiry resets the data if the expected data has expired', () => {
    let expects = new Expects(this.FakeRequest);
    this.FakeRequest.session.data.expire_at = moment().subtract(10, 'seconds');
    let result = expects.check_expiry();
    
    expect(result).to.equal(true);
    expect(expects.has()).to.equal(false);
  });


  it('check expiry returns false if expiry is not set', () => {
    let expects = new Expects(this.FakeRequest);
    let result = expects.check_expiry();
    
    expect(result).to.equal(false);
  });


  it('check expiry returns false if data is not set', () => {
    let expects = new Expects(this.FakeRequest);
    expects.reset();
    let result = expects.check_expiry();
    
    expect(result).to.equal(false);
  });


  it('can reset expects', () => {
    let expects = new Expects(this.FakeRequest);
    let result = expects.reset();
    
    expect(result).to.equal(true);
    expect(expects.has()).to.equal(false);
  });


  it('returns for get false if the data has expired', () => {
    let expects = new Expects(this.FakeRequest);
    this.FakeRequest.session.data.expire_at = moment().subtract(10, 'seconds');
    let result = expects.get();
    
    expect(result).to.equal(false);
    expect(expects.has()).to.equal(false);
  });


  it('can get data that has not expired', () => {
    let expects = new Expects(this.FakeRequest);
    this.FakeRequest.session.data.expire_at = moment().add(10, 'seconds');
    let result = expects.get();
    
    expect(result.foo).to.equal('bar');
    expect(expects.has()).to.equal(true);
  });


  it('can construct expects', () => {
    let expects = new Expects(this.FakeRequest);

    expect(expects.redirect).to.equal(false);
    expect(expects.finish).to.equal(false);
    expect(expects.expecting).to.equal(null);
  });


});