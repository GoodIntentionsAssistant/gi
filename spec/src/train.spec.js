describe('Train', function(){
  var Train = require('../../src/Train/train');
  var Config = require('../../src/config');
  var train;

  var fakeApp = new Object();
  fakeApp.Config = new Config({
    classifiers: {
      'default': {
        'classifier': 'classify'
      }
    }
  });
  fakeApp.log = function() {};
  fakeApp.error = function() {};


  beforeEach(function() {
    train = new Train();
    train.initialize(fakeApp);
  });


  it('no classifiers after initialize', function() {
    expect(train.status().classifiers_count).toEqual(0);
  });


  it('add a classifier', function() {
    train.add_classifier('foo','classify');
    expect(train.has_classifier('foo')).toEqual(true);
    expect(Object.keys(train.classifiers).length).toEqual(1);
    expect(typeof train.classifiers['foo'] == 'object').toEqual(true);
    expect(train.status().classifiers_count).toEqual(1);
  });


  it('add two classifiers and check the status is correct', function() {
    fakeApp.Config.write('classifiers.aaa', { 'classifier':'classify' });
    fakeApp.Config.write('classifiers.bbb', { 'classifier':'classify' });

    train.train('apple','foobar', {
      classifier: 'aaa'
    });
    train.train('apple','foobar', {
      classifier: 'bbb'
    });
    expect(train.status().classifiers_count).toEqual(2);
  });


  it('check if a classifier exists that is not created', function() {
    var result = train.has_classifier('foo');
    expect(result).toEqual(false);
  });


  it('train and make sure the classifier was created', function() {
    var result = train.train('foo','bar');
    expect(result).toEqual(true);
  });


  it('train and check find', function() {
    train.train('foo','hello world');
    var result = train.find('hello world');
    expect(result).toEqual('foo');
  });


  it('train "hello", "world" and "hello world" and try to find "hello world"', function() {
    train.train('yes','hello world');
    train.train('no','hello');
    train.train('no','world');

    var result = train.find('hello world');
    expect(result).toEqual('yes');
  });


  it('train apple, banana, strawberry', function() {
    train.train('apple','apple');
    train.train('banana','banana');
    train.train('strawberry','strawberry');

    expect(train.find('apple')).toEqual('apple');
    expect(train.find('banana')).toEqual('banana');
    expect(train.find('strawberry')).toEqual('strawberry');
  });


  it('train different classifier and make sure a search on default classifier fails', function() {
    fakeApp.Config.write('classifiers.foobar', { 'classifier':'classify' });

    train.train('apple','apple', {
      classifier: 'foobar'
    });
    train.add_classifier('main', 'classify');
    expect(train.find('apple')).toEqual(false);
  });


  it('train a different classifer and find', function() {
    fakeApp.Config.write('classifiers.myclassifier', { 'classifier':'classify' });

    train.train('apple','foobar', {
      classifier: 'myclassifier'
    });
    var result = train.find('apple', 'myclassifier');
    expect(result).toEqual('apple');
  });


  it('find on classifiers that do not exist', function() {
    expect(train.find('apple')).toEqual(false);
    expect(train.find('apple', 'myclassifier')).toEqual(false);
  });


});

