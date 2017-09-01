describe('Server', function(){
  var io = require('socket.io-client');
  var Server = require('../../src/server');
  var Config = require('../../src/config');
  var server;

  var fakeApp = new Object();
  fakeApp.Config = new Config({
    server: {
      port: 30661
    }
  });
  fakeApp.log = function() {};
  fakeApp.error = function() {};

  //Start server

  beforeEach(function() {
    server = new Server();
    server.initialize(fakeApp);
  });


  it('add client', function() {
    var fakeClient = new Object();

    server.add_client(fakeClient);

    expect(server.clients[0].ident).not.toBe(null);
    expect(server.clients[0].client).toBe(fakeClient);
    expect(server.clients.length).toBe(1);
  });


  it('add multiple client', function() {
    server.add_client(new Object());
    server.add_client(new Object());
    server.add_client(new Object());

    expect(server.clients.length).toBe(3);
  });


  it('add multiple clients and remove them', function() {
    var ident1 = server.add_client(new Object());
    var ident2 = server.add_client(new Object());
    var ident3 = server.add_client(new Object());

    server.remove_client(ident1);
    server.remove_client(ident2);
    server.remove_client(ident3);

    expect(server.clients.length).toBe(0);
  });


  it('check single client connect then disconnect', function(done) {
    server.start();

    var socket = io.connect('http://localhost:'+fakeApp.Config.read('server.port'));
    socket.on('connect', function(){

      socket.on('disconnect',function() {
        server.stop();

        setTimeout(function() {
          expect(server.clients.length).toBe(0);
          done();
        },50);
      });

      expect(server.clients.length).toBe(1);
      socket.close();
    });
  });

});

