const expect = require('chai').expect;

const Template = girequire('src/Response/template');

describe('Template', function() {

  it('can handle loops', () => {
    let template = new Template();
    template.set('people', [
      'Yehuda Katz',
      'Alan Johnson',
      'Charles Jolley'
    ]);

    let result = template.compile('{{#each people}}{{this}} {{/each}}');

    expect(result).to.equal('Yehuda Katz Alan Johnson Charles Jolley ');
  });


  it('can handle with', () => {
    let template = new Template();
    template.set('person', {
      first: 'Joe',
      last: 'Bloggs'
    });

    let result = template.compile('{{#with person}}{{first}} {{last}}{{/with}}');

    expect(result).to.equal('Joe Bloggs');
  });


  it('can handle nested data', () => {
    let template = new Template();
    template.set('multiple', {
      fruit: 'apple',
      drink: 'lemonade'
    });

    let result = template.compile('{{multiple.fruit}}, {{multiple.drink}}');

    expect(result).to.equal('apple, lemonade');
  });


  it('can handle basic variables', () => {
    let template = new Template();
    template.set('foo', 'one');
    template.set('bar', '');

    let result = template.compile('{{foo}}{{bar}}');

    expect(result).to.equal('one');
  });


  it('can set from user', () => {
    let template = new Template();
    template.data_from_user({
      foo: 'one',
      bar: 'two'
    });
    let result = template.compile('{{foo}} {{bar}}');

    expect(result).to.equal('one two');
  });


  it('can set from parameters', () => {
    let template = new Template();
    template.data_from_parameters({
      foo: { string: 'one' },
      bar: { string: 'two' }
    });
    let result = template.compile('{{foo}} {{bar}}');

    expect(result).to.equal('one two');
  });


  it('can set keys', () => {
    let template = new Template();
    expect(template.set('foo', 'bar')).to.equal(true);
    expect(template.set('bar', '')).to.equal(true);
    expect(template.set('test')).to.equal(true);
  });


});