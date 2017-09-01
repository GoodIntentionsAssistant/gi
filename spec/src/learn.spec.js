describe('Learn', function(){
  var Learn = require('../../src/learn');
  var Config = require('../../src/config');
  var learn;

  var fakeApp = new Object();
  fakeApp.Config = new Config({
    classifiers: {
      'main': {
        'classifier': 'classify'
      }
    }
  });
  fakeApp.log = function() {};
  fakeApp.error = function() {};


  beforeEach(function() {
    learn = new Learn();
    learn.initialize(fakeApp);
  });


  it('no classifiers after initialize', function() {
    expect(learn.status().classifiers_count).toEqual(0);
  });


  it('add a classifier', function() {
    learn.add_classifier('foo','classify');
    expect(learn.has_classifier('foo')).toEqual(true);
    expect(Object.keys(learn.classifiers).length).toEqual(1);
    expect(typeof learn.classifiers['foo'] == 'object').toEqual(true);
    expect(learn.status().classifiers_count).toEqual(1);
  });


  it('add two classifiers and check the status is correct', function() {
    fakeApp.Config.write('classifiers.aaa', { 'classifier':'classify' });
    fakeApp.Config.write('classifiers.bbb', { 'classifier':'classify' });

    learn.train('apple','foobar', {
      classifier: 'aaa'
    });
    learn.train('apple','foobar', {
      classifier: 'bbb'
    });
    expect(learn.status().classifiers_count).toEqual(2);
  });


  it('check if a classifier exists that is not created', function() {
    var result = learn.has_classifier('foo');
    expect(result).toEqual(false);
  });


  it('train and make sure the classifier was created', function() {
    var result = learn.train('foo','bar');
    expect(result).toEqual(true);
  });


  it('train and check find', function() {
    learn.train('foo','hello world');
    var result = learn.find('hello world');
    expect(result).toEqual('foo');
  });


  it('train "hello", "world" and "hello world" and try to find "hello world"', function() {
    learn.train('yes','hello world');
    learn.train('no','hello');
    learn.train('no','world');

    var result = learn.find('hello world');
    expect(result).toEqual('yes');
  });


  it('train apple, banana, strawberry', function() {
    learn.train('apple','apple');
    learn.train('banana','banana');
    learn.train('strawberry','strawberry');

    expect(learn.find('apple')).toEqual('apple');
    expect(learn.find('banana')).toEqual('banana');
    expect(learn.find('strawberry')).toEqual('strawberry');
  });


  it('train different classifier and make sure a search on default classifier fails', function() {
    fakeApp.Config.write('classifiers.foobar', { 'classifier':'classify' });

    learn.train('apple','apple', {
      classifier: 'foobar'
    });
    learn.add_classifier('main', 'classify');
    expect(learn.find('apple')).toEqual(false);
  });


  it('train a different classifer and find', function() {
    fakeApp.Config.write('classifiers.myclassifier', { 'classifier':'classify' });

    learn.train('apple','foobar', {
      classifier: 'myclassifier'
    });
    var result = learn.find('apple', 'myclassifier');
    expect(result).toEqual('apple');
  });


  it('find on classifiers that do not exist', function() {
    expect(learn.find('apple')).toEqual(false);
    expect(learn.find('apple', 'myclassifier')).toEqual(false);
  });


});

