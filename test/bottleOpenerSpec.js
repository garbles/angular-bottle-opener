'use strict';

describe('Service: $bottle', function () {
  var $bottle, bottle, key, data;

  key = 'key';
  data = {a:1};

  beforeEach(module('bottle.opener'));

  beforeEach(inject(function (_$bottle_) {
    $bottle = _$bottle_;
    bottle = $bottle('test').clean();
  }));

  it('initializes local storage', function () {
    expect(localStorage.getItem('test')).toBe('{}');
  });

  it('stores and retrieves local storage data', function() {
    bottle.set(key, data);

    expect(bottle.get(key)).toBe(data);
  });

  it('allows you to chain commands together', function() {
    expect(bottle.set(key, data).get(key)).toBe(data);
  });

  it('returns all of the data from the bottle', function() {
    bottle.set(key, data).set('other_key', data);

    expect(bottle.all()).toEqual({"key": data, "other_key": data});
  });
});
