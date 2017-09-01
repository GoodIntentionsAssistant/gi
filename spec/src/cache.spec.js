
describe('Cache', function(){
  var cache = require('../../src/cache.js');

  beforeEach(function() {
    Cache = new cache();
  });


  afterEach(function() {
  });
  

  it('write to cache with expire and make sure it is still set', function(done) {
    Cache.write('foo','bar',100);

    setTimeout(function() {
      expect(Cache.read('foo')).toEqual('bar');
      done();
    }, 50);
  });


  it('write to cache for short time and make sure it expires', function(done) {
    Cache.write('foo','bar',100);

    setTimeout(function() {
      expect(Cache.read('foo')).toEqual(false);
      done();
    }, 110);
  });
  

  it('writes to cache, clear then check size is 0', function() {
    //Add four
    Cache.write('foo1','bar');
    Cache.write('foo2','bar');
    Cache.write('foo3','bar');
    Cache.write('foo4','bar');

    //Remove all
    Cache.clear();

    expect(Cache.size()).toEqual(0);
  });


  it('writes to cache and size is correct', function() {
    //Add four
    Cache.write('foo1','bar');
    Cache.write('foo2','bar');
    Cache.write('foo3','bar');
    Cache.write('foo4','bar');

    //Remove one
    Cache.remove('foo4');

    //Update another
    Cache.write('foo1','barbar');

    expect(Cache.size()).toEqual(3);
  });


  it('writes to cache then removes the key', function() {
    Cache.write('foo','bar');

    let read_value_before = Cache.read('foo');
    Cache.remove('foo');
    let read_value_after = Cache.read('foo');

    expect(read_value_before).toEqual('bar');
    expect(read_value_after).toEqual(false);
  });


  it('reading from cache that is not set', function() {
    let read_value = Cache.read('foo');
    expect(read_value).toEqual(false);
  });


  it('can write to cache', function() {
    let written = Cache.write('foo','bar');
    let read_value = Cache.read('foo');

    expect(written).toEqual(true);
    expect(read_value).toEqual('bar');
  });


});

