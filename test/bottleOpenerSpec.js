'use strict';

describe('Service: $bottle', function () {
  var $bottle;

  beforeEach(module('bottle.opener'));

  beforeEach(inject(function (_$bottle_) {
    $bottle = _$bottle_;
  }));

  it('initializes local storage', function () {
    var key;

    key = 'test1';

    $bottle(key);

    expect(localStorage[key]).toBe('{}');
  });

  it('sets local storage data', function() {
    var key, data, dataStr;

    key = 'test2';
    data = {a:1};
    dataStr = angular.toJson({data: data});

    $bottle(key).store('data', data);

    expect(localStorage[key]).toBe(dataStr);
  });

  it('retrieves local storage data', function() {
    var bottle, data;

    bottle = $bottle('test3');
    data = {a:1};

    bottle.store('data', data);

    expect(bottle.retrieve('data')).toBe(data);
  });
});
