
const expect = require('chai').expect;
const Replacer = girequire('src/Utterance/replacer');

let dataPath = 'test/data/Language';

describe('Replacer', function() {


  it('can replace text from json and txt files', () => {
    let replacer = new Replacer();
    let result = replacer.process('Test', 'apple banana orange kiwi lime peach mango honeydew watermelon honeydew', { dataPath });
    expect(result).to.equal('kiwi monkey kiwi lemon peach mango honeydew watermelon end');
  });


  it('does no replacements if the data files are empty', () => {
    let replacer = new Replacer();
    let result = replacer.process('Empty', 'my text', { dataPath });
    expect(result).to.equal('my text');
  });


  it('can replace text from a json file', () => {
    let replacer = new Replacer();

    let entries = {
      "this": {
        "replace": "that"
      },
      "one": {
        "match": "end",
        "replace": "two"
      },
      "foobar": {
        "match": "start"
      },
      "word": {
        "replace": "bird"
      }
    };

    let result = replacer._replace('foobar this one word foobar and that one', entries);

    expect(result).to.equal('that one bird foobar and that two');
  });


  it('can replace text from a space separated .txt file', () => {
    let replacer = new Replacer();

    let text = `
this that
word +bird
and 
one one //ignore me
    `;
    let json = replacer._convertTxtToJson(text);

    let result = replacer._replace('replace this word and that one', json.entries);

    expect(result).to.equal('replace that bird that one');
  });


  it('can get list of files and ignore certain other files', () => {
    let replacer = new Replacer();
    replacer.dataPath = 'test/data/Language';

    let result = replacer._files('Empty', { lang:'en' });

    expect(result).to.be.lengthOf(2);
    expect(result[0].type).to.equal('txt');
    expect(result[1].type).to.equal('json');
  });


  it('can change path name for testing purposes', () => {
    let replacer = new Replacer();
    replacer.dataPath = 'test/data/Language';

    expect(replacer.directoryExists('Empty', 'en')).to.equal(true);
    expect(replacer.directoryExists('Empty', 'fr')).to.equal(true);
    expect(replacer.directoryExists('Empty', 'xx')).to.equal(false);
  });


  it('can generate path names based on the type and language', () => {
    let replacer = new Replacer();
    expect(replacer.pathName('Remove','en')).to.equal('./data/Language/en/Remove');
    expect(replacer.pathName('Remove','fr')).to.equal('./data/Language/fr/Remove');
    expect(replacer.pathName('Remove')).to.equal('./data/Language/en/Remove');
  });


  it('returns nothing if language directory not found', () => {
    let replacer = new Replacer();
    let result = replacer.process('Remove', 'my text', { lang:'xx' });
    expect(result).to.equal(false);
  });


  it('returns nothing if data directory not found', () => {
    let replacer = new Replacer();
    let result = replacer.process('Foobar', 'my text', {});
    expect(result).to.equal(false);
  });


});