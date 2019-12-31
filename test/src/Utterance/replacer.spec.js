
const expect = require('chai').expect;
const Replacer = girequire('src/Utterance/replacer');

describe('Replacer', function() {

  it('can replace text from a space separated .txt file', () => {
    let replacer = new Replacer();

    let entries = [
      'this that',
      'word +bird',
      'that',
      'one one //ignore me'
    ];

    let result = replacer._replaceTxt('replace this word and that one', entries);

    expect(result).to.equal('replace that bird and that one');
  });


  it('can get list of files and ignore certain other files', () => {
    let replacer = new Replacer();
    replacer.dataPath = 'test/data/Language';

    let result = replacer._files('Test', { lang:'en' });

    expect(result).to.be.lengthOf(2);
    expect(result[0].type).to.equal('txt');
    expect(result[1].type).to.equal('json');
  });


  it('can change path name for testing purposes', () => {
    let replacer = new Replacer();
    replacer.dataPath = 'test/data/Language';

    expect(replacer.directoryExists('Test', 'en')).to.equal(true);
    expect(replacer.directoryExists('Test', 'fr')).to.equal(true);
    expect(replacer.directoryExists('Test', 'xx')).to.equal(false);
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