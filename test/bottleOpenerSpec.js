'use strict';

describe('Service: $bottle', function () {
  var $bottle;

  beforeEach(module('bottle.opener'));

  beforeEach(inject(function (_$bottle_) {
    $bottle = _$bottle_;
  }));

  it('initializes local storage', function () {
    var key;

    key = 'test';

    $bottle(key);

    expect(localStorage[key]).toBe('{}');
  });

  it('stores and retrieves local storage data', function() {
    var bottle, data;

    bottle = $bottle('test');
    data = {a:1};

    bottle.set('data', data);

    expect(bottle.get('data')).toBe(data);
  });

  it('allows you to chain commands together', function() {
    var bottle, key, data;

    bottle = $bottle('test');
    key = 'key';
    data = {a:1};

    expect(bottle.set(key, data).get(key)).toBe(data);
  });
});
