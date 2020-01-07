
const expect = require('chai').expect;
const Dispatcher = girequire('src/Request/dispatcher');

const AttachmentRegistry = girequire('src/Attachment/attachment_registry.js');


describe('Dispatcher', function() {

  before(() => {
    this.FakeApp = new Object();
    this.FakeApp.AttachmentRegistry = new AttachmentRegistry(this.FakeApp);

    let FakeClient = {
      emit: function() {
      }
    };

    this.FakeApp.Server = {
      find_client: function() {
        return FakeClient;
      }
    };

    let FakeUser = {
      get: function() {
      }
    };

    this.FakeApp.Auth = {
      identify: function(id) {
        return { session: id, user:FakeUser };
      }
    };

    this.FakeApp.Event = {
      emit: function() {}
    }
  });


  it('can dispatch a basic ping request', () => {
    const RequestPing = girequire('/src/Request/Type/request_ping.js');

    this.FakeApp.AttachmentRegistry.load('Sys.Attachment.Ping');

    let dispatcher = new Dispatcher(this.FakeApp);
    let result = dispatcher.dispatch({
      ident: 'foobar',
      input: {
        client_id: 111,
        session_id: 222,
        type: 'ping'
      }
    });

    expect(result instanceof RequestPing).to.equal(true);
  });



  it('can dispatch and fail at incoming and auth', () => {
    let FakeApp = new Object();
    FakeApp.Server = {
      find_client: function(id) { return false; }
    };

    let dispatcher = new Dispatcher(FakeApp);

    let fail_input = dispatcher.dispatch({});
    let fail_type = dispatcher.dispatch({ input: { type:'foobar' } });
    let fail_auth = dispatcher.dispatch({ input: { type:'ping' } });

    expect(fail_input).to.equal(false);
    expect(fail_type).to.equal(false);
    expect(fail_auth).to.equal(false);
  });



  it('can handle when auth fails to find or create the session', () => {
    let FakeApp = new Object();
    FakeApp.Server = {
      find_client: function(id) { return id; }
    };
    FakeApp.Auth = {
      identify: function(id) { return false; }
    };

    let dispatcher = new Dispatcher(FakeApp);
    let result = dispatcher.auth({input: { client_id: 111, session_id: 222 }});

    expect(result).to.equal(false);
  });


  it('can handle when auth fails to find the client', () => {
    let FakeApp = new Object();
    FakeApp.Server = {
      find_client: function(id) { return false; }
    };

    let dispatcher = new Dispatcher(FakeApp);
    let result = dispatcher.auth({input: { client_id: 111, session_id: 222 }});

    expect(result).to.equal(false);
  });


  it('can fetch fake auth data', () => {
    let dispatcher = new Dispatcher(this.FakeApp);

    let result = dispatcher.auth({
      input: {
        client_id: 111,
        session_id: 222
      }
    });

    expect(result.user).to.be.an('object');
    expect(result.client).to.be.an('object');
  });


  it('can validate type', () => {
    let dispatcher = new Dispatcher(this.FakeApp);

    expect(dispatcher.validate_type('')).to.equal(false);
    expect(dispatcher.validate_type(null)).to.equal(false);
    expect(dispatcher.validate_type('foobar')).to.equal(false);
    expect(dispatcher.validate_type('aa ping aa')).to.equal(false);

    expect(dispatcher.validate_type('message')).to.equal(true);
    expect(dispatcher.validate_type('intent')).to.equal(true);
    expect(dispatcher.validate_type('event')).to.equal(true);
    expect(dispatcher.validate_type('ping')).to.equal(true);
  });


  it('can validate input', () => {
    let dispatcher = new Dispatcher(this.FakeApp);

    expect(dispatcher.validate_input({})).to.equal(false);
    expect(dispatcher.validate_input('')).to.equal(false);

    expect(dispatcher.validate_input({ foo:'bar' })).to.equal(true);
  });


});