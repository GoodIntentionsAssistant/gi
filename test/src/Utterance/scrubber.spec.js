
const expect = require('chai').expect;
const Scrubber = girequire('src/Utterance/scrubber');

describe('Scrubber', function() {


  it('can fix spelling mistakes', () => {
    let result = Scrubber.spelling('yoghurt accually agian');
    expect(result).to.equal('yogurt actually again');
  });


  it('can do substitute words', () => {
    let result = Scrubber.substitutes('what\'s how\'s');
    expect(result).to.equal('what is how is');
  });


  it('can remove stop words', () => {
    let result = Scrubber.stop_words('what i am in the my foobar');
    expect(result).to.equal('foobar');
  });


  it('can remove grammar', () => {
    let result = Scrubber.grammar('that, is - so. cool!?');
    expect(result).to.equal('that is so cool');
  });


  it('can replace octal numbers with numerical numbers', () => {
    let result = Scrubber.octal('this is a list of numbers one, 2, three, 4, ten, one-hundred');
    expect(result).to.equal('this is a list of numbers 1, 2, 3, 4, 10, 100');
  });


  it('can convert text into sentence case', () => {
    let result = Scrubber.sentence_case('this is my world');
    expect(result).to.equal('This is my world');
  });


  it('can lower case text', () => {
    let result = Scrubber.lower('FOOBAR');
    expect(result).to.equal('foobar');
  });


  it('can filter out strings less than a certain length', () => {
    let result = Scrubber.token_length('a bc def ghij', 2);
    expect(result).to.equal('def ghij');
  });


  it('can remove brackets from text', () => {
    let result = Scrubber.brackets('(foobar)');
    expect(result).to.equal('foobar');
  });


});