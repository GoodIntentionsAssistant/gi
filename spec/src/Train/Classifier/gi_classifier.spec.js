
fdescribe('GiClassifier', function(){
  var GiClassifier = require('../../../../src/Train/Classifier/gi_classifier');
  var Utterance = require('../../../../src/Utterance/utterance');

  beforeEach(function() {
    classifier = new GiClassifier();
  });


  fit('search for hello', function() {
    classifier.train('AAA', 'hello world');
    classifier.train('BBB', 'hello');
    classifier.train('CCC', 'world');

    let utterance = new Utterance('hello');

    result = classifier.find(utterance);

    console.log(result);
  });



  it('basic training', function() {
    classifier.train('AAA', 'hello world');
    classifier.train('BBB', 'hello');
    classifier.train('CCC', 'world');

    expect(classifier.data.length).toEqual(3);

    expect(classifier.data[0]).toEqual({
      intent: 'AAA',
      keyword: 'hello world',
      pos: ['UH', 'NN']
    });

    expect(classifier.data[1]).toEqual({
      intent: 'BBB',
      keyword: 'hello',
      pos: ['UH']
    });

    expect(classifier.data[2]).toEqual({
      intent: 'CCC',
      keyword: 'world',
      pos: ['NN']
    });
  });



});

