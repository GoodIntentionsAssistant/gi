
const expect = require('chai').expect;
const Queue = girequire('src/Request/queue');

const Promise = require('promise');
const moment = require('moment');
const EventEmitter = require('events').EventEmitter;



describe.only('Queue', function() {

  before(() => {
    this.FakeApp = new Object();
    this.FakeApp.on = function() {};

    this.FakeDispatcher = {
      dispatch: function() {
        let request = {};
        request.promise = new Promise((resolve, reject) => {
        });
        return request;
      }
    }
  });


  it('will not run the queue if the queue is not active and the event app.loop is emitted', () => {
    class FakeApp extends EventEmitter {
    }
    
    let FakeAppWithEmitter = new FakeApp();
    
    let queue = new Queue(FakeAppWithEmitter);
    queue.add({ foo: 'bar' }, false);

    queue.app.emit('app.loop');

    expect(queue.queue.length).is.equal(1);
  });


  it('can check the queue based on app.loop event', () => {
    class FakeApp extends EventEmitter {
    }

    let FakeAppWithEmitter = new FakeApp();
    
    let queue = new Queue(FakeAppWithEmitter);
    queue.active = true;
    queue.add({ foo: 'bar' }, false);

    let before_length = queue.queue.length;

    queue.app.emit('app.loop');

    let after_length = queue.queue.length;

    expect(before_length).is.equal(1);
    expect(after_length).is.equal(0);
  });


  it('can check if requests are timed out', () => {
    let queue = new Queue(this.FakeApp);
    queue.queue_timeout = 1000;

    queue.requests = {
      foo: {
        active: true,
        request: {
          last_activity: Date.now(),
          timeout: function() { return true; }
        }
      },
      bar: {
        active: true,
        request: {
          last_activity: moment().subtract(5, 'second'),
          timeout: function() { return true; }
        }
      },
      timedout: {
        active: false
      }
    };

    let result = queue.check_timed_out();

    expect(result).to.equal(true);

    expect(queue.requests.foo.active).to.equal(true);
    expect(queue.requests.bar.active).to.equal(false);
    expect(queue.requests.timedout.active).to.equal(false);
  });


  it('can reject a queue record with the same ident', () => {
    let queue = new Queue(this.FakeApp);
    queue.dispatcher = this.FakeDispatcher;

    queue.request({
      ident: 'foobar'
    });

    let result = queue.request({
      ident: 'foobar'
    });

    expect(result).to.equal(false);
  });


  it('can make a request to a fake dispatcher and add to request array', () => {
    let queue = new Queue(this.FakeApp);
    queue.dispatcher = this.FakeDispatcher;

    let result = queue.request({
      ident: 'foobar'
    });

    expect(result).to.equal(true);
    expect(queue.requests.foobar).to.not.equal(null);
    expect(queue.requests.foobar.active).to.equal(true);
    expect(queue.requests.foobar.request).to.not.equal(null);
  });


  it('fails to make a request to dispatcher if request input is invalid', () => {
    let queue = new Queue(this.FakeApp);
    let result = queue.request({
    });
    
    expect(result).to.equal(false);
  });


  it('can destroy a request', () => {
    let queue = new Queue(this.FakeApp);
    queue.requests.foobar = 'test';

    let result = queue.destroy_request('foobar');
    expect(result).to.equal(true);
  });


  it('cannot destroy a request that does not exist', () => {
    let queue = new Queue(this.FakeApp);
    let result = queue.destroy_request('abc');
    expect(result).to.equal(false);
  });


  it('can skip the queue', () => {
    let queue = new Queue(this.FakeApp);
    let result = queue.add({ foo: 'bar', skip_queue: true });

    expect(result).to.equal(false, 'It will fail at dispatch');
    expect(queue.queue).to.have.lengthOf(0);
    expect(queue.requests).to.have.lengthOf(0);
  });


  it('can add to the queue and check if the request should be done instantly', () => {
    let queue = new Queue(this.FakeApp);
    let result = queue.add({ foo: 'bar' });

    expect(result).is.equal(true);
    expect(queue.queue).to.have.lengthOf(0);
  });


  it('can add to the queue', () => {
    let queue = new Queue(this.FakeApp);
    let result = queue.add({ foo: 'bar' }, false);

    expect(result).is.equal(true);
    expect(queue.queue).to.have.lengthOf(1);

    expect(queue.queue[0].ident).is.not.equal(null);
    expect(queue.queue[0].input.foo).is.equal('bar');
  });


  it('can start the queue', () => {
    let queue = new Queue(this.FakeApp);
    queue.start();
    expect(queue.active).is.equal(true);
  });


  it('construct queue with variables reset', () => {
    let queue = new Queue(this.FakeApp);

    expect(queue.queue).is.eql([]);
    expect(queue.requests).is.eql([]);
    expect(queue.active).is.equal(false);
  });


});