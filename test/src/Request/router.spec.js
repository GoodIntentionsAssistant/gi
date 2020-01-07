
const expect = require('chai').expect;
const Router = girequire('src/Request/router');

const IntentRegistry = girequire('src/Intent/intent_registry.js');
const Utterance = girequire('src/Utterance/utterance');


describe('Router', function() {

  before(() => {
    this.FakeApp = new Object();

    this.FakeApp.Event = {
      emit: function() {
        this.emitted = true;
      }
    };

    this.FakeApp.IntentRegistry = new IntentRegistry();

    this.FakeRequest = new Object();
    this.FakeRequest.app = this.FakeApp;
  });


  it('can return error if utterance is not understood', () => {
    this.FakeApp.Understand = {
      process: function() {
        return {
          success: false
        };
      }
    };

    let utterance = new Utterance('foobar');
    let router = new Router(this.FakeRequest);
    let result = router.route(utterance);

    expect(result).to.equal(false);
  });


  it('can throw error if understand returns data wrong', () => {
    this.FakeApp.Understand = {
      process: function() {
        return {};
      }
    };

    let utterance = new Utterance('foobar');
    let router = new Router(this.FakeRequest);

    expect(() => { router.route(utterance); }).to.throw(Error);
  });


  it('can route successfully', () => {
    this.FakeApp.Understand = {
      process: function() {
        return {
          matches: [{
            collection: 'foobar',
            confidence: 0.1,
            indent: new Object(),
            success: true
          }]
        };
      }
    };

    let utterance = new Utterance('foobar');

    let router = new Router(this.FakeRequest);
    let result = router.route(utterance);

    expect(result).to.eql({
      collection: 'foobar',
      confidence: 0.1,
      indent: new Object(),
      success: true
    });
  });


  it('returns the error instance and triggers unknown event', () => {
    this.FakeApp.IntentRegistry.objects['App.Basics.Intent.NotFound'] = { foo:'bar' };

    let router = new Router(this.FakeRequest);
    let result = router.error('NotFound');

    expect(this.FakeApp.Event.emitted).to.equal(true);

    expect(result).to.eql({
      collection: null,
      confidence: -1,
      intent: { foo: 'bar' } 
    });
  });


  it('returns the error instance', () => {
    this.FakeApp.IntentRegistry.objects['App.Basics.Intent.Foobar'] = { foo:'bar' };

    let router = new Router(this.FakeRequest);
    let result = router.error('Foobar');

    expect(result).to.eql({
      collection: null,
      confidence: -1,
      intent: { foo: 'bar' } 
    });
  });


  it('fails if the error intent not found', () => {
    let router = new Router(this.FakeRequest);
    let result = router.error('FoobarXyz');
    expect(result).to.equal(false);
  });


});