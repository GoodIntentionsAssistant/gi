
const expect = require('chai').expect;
const Dispatcher = girequire('src/Request/dispatcher');



describe.only('Dispatcher', function() {

  before(() => {
    this.FakeApp = new Object();
    this.FakeApp.on = function() {};
  });


  it('construct queue with variables reset', () => {
  });


});