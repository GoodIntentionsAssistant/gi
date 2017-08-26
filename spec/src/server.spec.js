describe('Server', function(){
  var io = require('socket.io-client');
  var Server = require('../../src/server');
  var server;

  var fakeApp = new Object();
  fakeApp.config = {
    server: {
      port: 306661
    }
  };
  fakeApp.log = function() {};
  fakeApp.error = function() {};

  //Start server

  beforeEach(function() {
    server = new Server();
    server.initialize(fakeApp);
  });


  it('add agent', function() {
    var fakeAgent = new Object();

    server.add_agent(fakeAgent);

    expect(server.agents[0].ident).not.toBe(null);
    expect(server.agents[0].agent).toBe(fakeAgent);
    expect(server.agents.length).toBe(1);
  });


  it('add multiple agent', function() {
    server.add_agent(new Object());
    server.add_agent(new Object());
    server.add_agent(new Object());

    expect(server.agents.length).toBe(3);
  });


  it('add multiple agents and remove them', function() {
    var ident1 = server.add_agent(new Object());
    var ident2 = server.add_agent(new Object());
    var ident3 = server.add_agent(new Object());

    server.remove_agent(ident1);
    server.remove_agent(ident2);
    server.remove_agent(ident3);

    expect(server.agents.length).toBe(0);
  });


  it('check single agent connect then disconnect', function(done) {
    server.start();

    var socket = io.connect('http://localhost:'+fakeApp.config.server.port);
    socket.on('connect', function(){

      socket.on('disconnect',function() {
        server.stop();

        setTimeout(function() {
          expect(server.agents.length).toBe(0);
          done();
        },50);
      });

      expect(server.agents.length).toBe(1);
      socket.close();
    });
  });

});

