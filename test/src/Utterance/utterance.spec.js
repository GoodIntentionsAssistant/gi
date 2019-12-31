const expect = require('chai').expect;
const Utterance = girequire('src/Utterance/utterance.js');

describe('Utterance', function() {

  it('labelled basic text', () => {
    let utterance = new Utterance();
    utterance.set('is that a happy face?');
    let result = utterance.labels();

    expect(result).to.have.lengthOf(6);
    expect(utterance.is('question')).to.equal(true);
    expect(utterance.is('negative')).to.not.equal(true);
  });

  it('scrubbed basic text', () => {
    let utterance = new Utterance();
    utterance.set('LOWER!? a b c one two');
    let result = utterance.scrubbed();
    expect(result).to.equal('lower a b c 1 2');
  });


  it('should set text on construct', () => {
    let utterance = new Utterance('hello');
    expect(utterance.text()).to.equal('hello');
  });


  it('should set data structure and trim the text', () => {
    let utterance = new Utterance();
    utterance.set(' hello ');
    let result = utterance.get();
    
    expect(result).to.be.a('Object');
    expect(result.original).to.equal('hello');
    expect(result.text).to.equal('hello');

    expect(utterance.original()).to.equal('hello');
    expect(utterance.text()).to.equal('hello');
    expect(utterance.scrubbed()).to.equal('hello');
  });


});