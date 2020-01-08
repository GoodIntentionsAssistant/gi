const expect = require('chai').expect;
const Labeler = girequire('src/Utterance/labeler');

describe('Labeler', function() {


  it('should handle empty text', () => {
    let labeler = new Labeler();
    expect(labeler.label('')).to.equal(false);
  });


  it('should ignore pound sign in parts of speech', () => {
    let labeler = new Labeler();
    labeler.label('#');
    expect(labeler._pos).to.be.lengthOf(0);
  });


  it('should have no pos', () => {
    let labeler = new Labeler();
    labeler.label('aaa');
    expect(labeler._pos).to.be.lengthOf(0);
  });


  it('should be able to check if positive, negative or neutral', () => {
    let labeler1 = new Labeler();
    labeler1.label('i feel happy');
    expect(labeler1.is('positive')).to.equal(true);

    let labeler2 = new Labeler();
    labeler2.label('i feel sad');
    expect(labeler2.is('negative')).to.equal(true);

    let labeler3 = new Labeler();
    labeler3.label('i feel ok');
    expect(labeler3.is('neutral')).to.equal(true);
  });


  it('should be able to label text', () => {
    let labeler = new Labeler();
    labeler.label('how are you?');
    
    expect(labeler.labels()).to.be.a('Array');

    expect(labeler.is('question')).to.equal(true);
    expect(labeler.is('neutral')).to.equal(true);
    expect(labeler.is('verb')).to.equal(true);
  });


  it('should be able to add a new label', () => {
    let labeler = new Labeler();
    
    expect(labeler.add('test')).to.equal(true);
    expect(labeler.add('test')).to.equal(false); //Cannot add twice

    expect(labeler.is('test')).to.equal(true);
    expect(labeler.is('nothing')).to.equal(false);
  });


  it('should initalize with empty data', () => {
    let labeler = new Labeler();
    
    expect(labeler._text).to.equal(null);

    expect(labeler._labels).to.be.a('Array');
    expect(labeler._pos).to.be.a('Array');

    expect(labeler._labels).to.have.lengthOf(0);
    expect(labeler._pos).to.have.lengthOf(0);
  });


});