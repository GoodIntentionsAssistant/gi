
const expect = require('chai').expect;
const Dialog = girequire('src/Response/dialog');
const Config = girequire('src/Config/config');


describe('Dialog', function() {

  before(() => {
    Config._init();

    this.original_root = global.gi_config.paths.root;
    global.gi_config.paths.root = '/../../test';
  });

  after(() => {
    global.gi_config.paths.root = this.original_root;
  });


  it('falls back to english if it fails to find the language file', () => {
    let dialog = new Dialog();
    let result = dialog.process('foobar.simple', {
      skill: 'Test',
      lang: 'fr'
    });
    expect(result).to.equal('foobar');
  });


  it('can extract simple dialog from different language', () => {
    let dialog = new Dialog();
    let result = dialog.process('french.oui', {
      skill: 'Test',
      lang: 'fr'
    });
    expect(result).to.equal('non');
  });


  it('can extract array dialog', () => {
    let dialog = new Dialog();
    let result = dialog.process('foobar.list', {
      skill: 'Test'
    });
    expect(result).to.be.oneOf(['a', 'b', 'c']);
  });


  it('can extract simple dialog', () => {
    let dialog = new Dialog();
    let result = dialog.process('foobar.simple', {
      skill: 'Test'
    });
    expect(result).to.equal('foobar');
  });


  it('throws error if the key was not found', () => {
    let dialog = new Dialog();
    expect(() => { dialog.process('foobar.nothing', { skill: 'Test' }); }).to.throw(Error, 'Object key nothing for App.Skill.Test.Dialog.en.foobar dialog could not be found');
  });


  it('throws error if the dialog file is totally empty', () => {
    let dialog = new Dialog();
    expect(() => { dialog.process('nothing', { skill: 'Test' }); }).to.throw(Error, 'App.Skill.Test.Dialog.en.nothing');
  });


  it('throws error if the dialog file is just an empty json', () => {
    let dialog = new Dialog();
    expect(() => { dialog.process('empty', { skill: 'Test' }); }).to.throw(Error, 'App.Skill.Test.Dialog.en.empty');
  });


  it('throws error if skill not found', () => {
    let dialog = new Dialog();
    expect(() => { dialog.process('foobar', { skill: 'Nothing' }); }).to.throw(ReferenceError);
  });


  it('throws error if no skill defined', () => {
    let dialog = new Dialog();
    expect(() => { dialog.process('foobar'); }).to.throw(ReferenceError, 'Skill for dialog foobar was not defined');
  });


});