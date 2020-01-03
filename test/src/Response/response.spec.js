
const expect = require('chai').expect;
const Response = girequire('src/Response/response');
const AttachmentRegistry = girequire('src/Attachment/attachment_registry.js');
const Log = girequire('src/Core/log.js');

describe.only('Response', function() {

  beforeEach(() => {
    //Create a fake instances
    this.FakeApp = new Object();
    this.FakeApp.AttachmentRegistry = new AttachmentRegistry(this.FakeApp);
    this.FakeApp.Log = new Log(this.FakeApp);

    this.FakeRequest = new Object();
    this.FakeRequest.log = function() {};
    this.FakeRequest.cancel = function() {};
    this.FakeRequest.app = this.FakeApp;
    this.FakeRequest.input = { user:'darren' }
    this.FakeRequest.ident = 'foobar';
    this.FakeRequest.client = {
      emit: function(namespace, data) {
        this._namespace = namespace;
        this._data = data;
        return true;
      }
    };
    this.FakeRequest.parameters = {
      get: function() {}
    };
    this.FakeRequest.user = {
      get: function() {}
    };
    this.FakeRequest.session = { session_id:'123' };
  });
  


  it('send a message with an attachment', () => {
    this.FakeApp.AttachmentRegistry.load('Sys.Attachment.Message');

    let response = new Response(this.FakeRequest);

    response.attachment('message', 'foo');
    let result = response.send({});

    expect(result).to.equal(true);
    expect(response.typing).to.equal(false);
    expect(response.attachments()).to.eql({}, 'Attachments have been cleared');
  });


  it('fails to send if client is invalid', () => {
    delete(this.FakeRequest.client);
    let response = new Response(this.FakeRequest);
    let result = response.send({});
    expect(result).to.equal(false);
  });


  it('fails to send if no attachments', () => {
    let response = new Response(this.FakeRequest);
    let result = response.send({});
    expect(result).to.equal(false);
  });


  it('can load and fetch variables and start typing', () => {
    let response = new Response(this.FakeRequest);
    let result = response.load();

    expect(result).to.equal(true);
    expect(response.typing).to.equal(true);
  });



  it('can build message with no intent', () => {
    let response = new Response(this.FakeRequest);
    let result = response.build({});

    expect(result).to.eql({
      type: 'message',
      ident: 'foobar',
      user: 'darren',
      attachments: {}
    });
  });


  it('can build message with no attachments', () => {
    this.FakeRequest.collection = 'test-collection';
    this.FakeRequest.intent = { identifier: 'test-identifier' };
    this.FakeRequest.action = 'test-action';
    this.FakeRequest.confidence = 1;

    let response = new Response(this.FakeRequest);
    let result = response.build({});

    expect(result.type).to.equal('message');
    expect(result.ident).to.equal('foobar');
    expect(result.user).to.equal('darren');
    expect(result.attachments).to.eql({});
    expect(result.collection).to.equal('test-collection');
    expect(result.intent).to.equal('test-identifier');
    expect(result.action).to.equal('test-action');
    expect(result.confidence).to.equal(1);
  });


  it('cannot send start typing twice', () => {
    let response = new Response(this.FakeRequest);
    response.start_typing({});
    let result = response.start_typing({});

    expect(result).to.equal(false);
    expect(response.typing).to.equal(true);
  });


  it('can send end typing', () => {
    let response = new Response(this.FakeRequest);
    let result = response.end_typing({});
    expect(result).to.equal(true);
    expect(response.typing).to.equal(false);
  });


  it('can send start typing', () => {
    let response = new Response(this.FakeRequest);
    let result = response.start_typing({});
    expect(result).to.equal(true);
    expect(response.typing).to.equal(true);
  });


  it('can increase the sequence when sending messages', () => {
    let response = new Response(this.FakeRequest);
    response.send_to_client({});
    response.send_to_client({});
    response.send_to_client({});
    expect(response.sequence_count).to.equal(3);
  });


  it('can send a message with a different namespace', () => {
    this.FakeRequest.input.namespace = 'foobar';

    let response = new Response(this.FakeRequest);
    response.send_to_client({});

    expect(this.FakeRequest.client._namespace).to.equal('response::foobar');
    expect(this.FakeRequest.client._data.namespace).to.equal('response::foobar');
  });


  it('can send message to client', () => {
    let response = new Response(this.FakeRequest);
    let result = response.send_to_client({});
    expect(result).to.equal(true);
    expect(response.sequence_count).to.equal(1);

    expect(this.FakeRequest.client._namespace).to.equal('response');
    expect(this.FakeRequest.client._data.namespace).to.equal('response');
    expect(this.FakeRequest.client._data.ident).to.equal('foobar');
    expect(this.FakeRequest.client._data.session_id).to.equal('123');
    expect(this.FakeRequest.client._data.sequence).to.equal(1);
    expect(this.FakeRequest.client._data.microtime).to.not.equal(null);
  });


  it('can fail to send the message if the client is not valid', () => {
    delete(this.FakeRequest.client);
    let response = new Response(this.FakeRequest);
    let result = response.send_to_client({});
    expect(result).to.equal(false);
  });


  it('can check if the client is valid', () => {
    let response = new Response(this.FakeRequest);
    let result = response.valid_client();
    expect(result).to.equal(true);
  });


  it('can check if the client is not valid', () => {
    delete(this.FakeRequest.client);
    let response = new Response(this.FakeRequest);
    let result = response.valid_client();
    expect(result).to.equal(false);
  });
  

  it('can set a variable for templating', () => {
    this.FakeApp.AttachmentRegistry.load('Sys.Attachment.Message');

    let response = new Response(this.FakeRequest);
    let result1 = response.attachment('message', 'foo');
    let result2 = response.attachment('message', 'bar');

    expect(result1).to.equal(true);
    expect(result2).to.equal(true);

    expect(response.attachments()).to.eql({
      message: [
        { text: 'foo' },
        { text: 'bar' }
      ]
    });
  });


  it('cannot add an attachment for an unknown attachment type', () => {
    let response = new Response(this.FakeRequest);
    expect(() => { response.attachment('foobar', 'foobar'); }).to.throw(Error, `Attachment for "foobar" could not be found and has not been loaded`);
  });


  it('can fetch and clear attachments', () => {
    let response = new Response(this.FakeRequest);
    response._attachments = { 'foo': 'bar' }

    expect(response.attachments()).to.eql({ 'foo': 'bar' });
    expect(response.clearAttachments()).to.equal(true);
    expect(response.attachments()).to.eql({ });
  });


  it('can set a variable for templating', () => {
    let response = new Response(this.FakeRequest);
    expect(response.set('foo','bar')).to.equal(true);
    expect(response.set('bar')).to.equal(true);
  });


});