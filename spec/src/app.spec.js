describe('App', function(){
  const Promise = require('promise');
  var app;

  beforeEach(function() {
    app = require('../../src/app');
    app.verbose = false;
  });


  afterEach(function() {
    app.Server.stop();
  });



  it('load basic app and make sure entities and intents have loaded', function(done) {
    app.load(['Common','Admin']);

    expect(app.apps.length).toBe(2);

    Promise.all(app.Entities.promises).then(function() {
      expect(Object.keys(app.Entities.objects).length > 0).toBe(true);

      //Intents
      setTimeout(function() {
        Promise.all(app.Intents.promises).then(function() {
          expect(Object.keys(app.Intents.objects).length > 0).toBe(true);
          done();
        });
      },100);

    });
  });


  it('check queue starts after app loads', function(done) {
    app.load(['Common','Admin']);

    setTimeout(function() {
      expect(app.Queue.active).toBe(true);
      done();
    },50);
  });


  it('make a request', function() {
    app.load(['Common','Admin']);

    var client = new Object();
    var input = new Object();
    app.request(client, input);

    expect(app.Queue.queue.length).toBe(1);
  });



  it('make 50 requests', function() {
    app.load(['Common','Admin']);

    var client = new Object();
    var input = new Object();

    for(var ii=0; ii<50; ii++) {
      app.request(client, input); 
    }

    expect(app.Queue.queue.length).toBe(50);
  });


  it('log (to do)', function() {
    app.log('hello!');
    expect(true).toBe(true);
  });


  it('error (to do)', function() {
    app.error('hello!');
    expect(true).toBe(true);
  });



});

