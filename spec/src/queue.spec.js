describe('Queue', function(){
  var Queue = require('../../src/Request/queue');
  var Config = require('../../src/config');
  var queue;

  var fakeApp = new Object();
  fakeApp.log = function() {};
  fakeApp.error = function() {};

  var fakeClient = new Object();

  var Promise = require('promise');

  beforeEach(function() {
    queue = new Queue();
    queue.initialize(fakeApp);
  });


  it('add something to the queue', function() {
    queue.add(fakeClient,'user input example');
    expect(queue.queue.length).toEqual(1);
    expect(queue.queue[0]['ident']).not.toEqual(null);
    expect(queue.queue[0]['client']).toEqual(fakeClient);
    expect(queue.queue[0]['input']).toEqual('user input example');
  });


  it('add multiple items to the queue', function() {
    queue.add(fakeClient,'user input example 1');
    queue.add(fakeClient,'user input example 2');
    queue.add(fakeClient,'user input example 3');
    expect(queue.queue.length).toEqual(3);
    expect(queue.status().queue_length).toEqual(3);
  });


  it('make a request directly without the loop', function() {
    var request = {
      ident: 'foobar',
      input: false,
      client: false
    };
    var request = queue.request(request);
    expect(typeof request == 'object').toEqual(true);
    expect(queue.status().active_requests).toEqual(1);
  });


  it('make direct request, destory it then make sure it is not active', function(done) {
    var request = {
      ident: 'foobar',
      input: false,
      client: false
    };
    var request = queue.request(request);
    queue.start();

    setTimeout(function() {
      expect(queue.status().active_requests).toEqual(0);
      done();
    },50);
  });


  it('loop one request', function(done) {
    var client = false;
    queue.add(client,'my input');

    queue.start();

    setTimeout(function() {
      expect(queue.status().queue_length).toEqual(0);
      expect(queue.status().active_requests).toEqual(0);
      done();

      clearTimeout(queue.timer);
    },50);
  });


  it('requests and max consecutive as 1', function(done) {
    var client = false;

    queue.max_consecutive = 1;
    queue.speed = 50;

    queue.add(client,'my input 1');
    queue.add(client,'my input 2');

    queue.loop();

    setTimeout(function() {
      expect(queue.status().queue_length).toEqual(1);
      clearTimeout(queue.timer);
      done();
    },(queue.speed / 2));
  });


  it('requests and max consecutive as 5', function(done) {
    var client = false;

    queue.max_consecutive = 5;
    queue.speed = 20;

    //Will process these within 20 cycles
    queue.add(client,'my input 1');
    queue.add(client,'my input 2');
    queue.add(client,'my input 3');
    queue.add(client,'my input 4');
    queue.add(client,'my input 5');

    //After 20 cycles these will wait
    queue.add(client,'my input 6');
    queue.add(client,'my input 7');
    queue.add(client,'my input 8');
    queue.add(client,'my input 9');
    queue.add(client,'my input 10');

    queue.loop();

    setTimeout(function() {
      expect(queue.status().queue_length).toEqual(5);
      clearTimeout(queue.timer);
      done();
    },(queue.speed * 5));
  });



});

