const expect = require('chai').expect;

const History = girequire('src/Auth/history');
const Session = girequire('src/Auth/session');
const Utterance = girequire('src/Utterance/utterance');

describe('History', function() {

  it('can add one history record and it is not possible to fetch previous', () => {
    this.FakeRequest = new Object();
    this.FakeRequest.session = new Session();

    let history = new History(this.FakeRequest);

    let utterance1 = new Utterance();
    utterance1.set('foo');
    history.add(utterance1);

    let result = history.last();

    expect(result).is.equal(false);
  });


  it('can add two history records and fetch last history', () => {
    this.FakeRequest = new Object();
    this.FakeRequest.session = new Session();

    let history = new History(this.FakeRequest);

    let result1 = history.last();

    let utterance1 = new Utterance();
    utterance1.set('foo');
    history.add(utterance1);

    let utterance2 = new Utterance();
    utterance2.set('bar');
    history.add(utterance2);

    let result2 = history.last();

    expect(result1).is.equal(false);
    expect(result2).is.a('Object');
    expect(result2.text).is.equal('foo');
  });


  it('can add and fetch all history', () => {
    this.FakeRequest = new Object();
    this.FakeRequest.session = new Session();

    let history = new History(this.FakeRequest);

    let utterance1 = new Utterance();
    utterance1.set('foo');
    history.add(utterance1);

    let utterance2 = new Utterance();
    utterance2.set('bar');
    history.add(utterance2);

    let result = history.get();

    expect(result).is.a('Array');
    expect(result).to.have.a.lengthOf(2);
  });


  it('can fetch empty history', () => {
    this.FakeRequest = new Object();
    this.FakeRequest.session = new Session();

    let history = new History(this.FakeRequest);
    let result = history.get();

    expect(result).is.a('Array');
    expect(result).to.have.a.lengthOf(0);
  });



});