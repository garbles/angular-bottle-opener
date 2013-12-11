'use strict';

describe('Service: $bottle', function () {
  var $bottle, bottle, key, data, otherData, api;

  key = 'key';
  data = {a:1};
  otherData = {b: 1}
  api = 'http://www.example.com/api/';

  beforeEach(module('bottle.opener'));

  beforeEach(inject(function (_$bottle_, $httpBackend) {
    $bottle = _$bottle_;
    $httpBackend.when('GET', api + 'derp').respond(otherData);
    bottle = $bottle({key: 'test'}).clean();
  }));

  it('initializes local storage', function () {
    expect(localStorage.getItem('test')).toBe('{}');
  });

  it('stores and retrieves local storage data', function() {
    bottle.set(key, data);

    bottle.get(key).then(function(result) {
      expect(result.data).toBe(data);
    });
  });

  it('returns an empty object if the slug is not found', function() {
    bottle.get('derp').then(function(result) {
      expect(result.data).toBeUndefined();
    })
  });

  it('allows you to chain commands together', function() {
    bottle.set(key, data).get(key).then(function(result) {
      expect(result.data).toBe(data);
    });
  });

  it('returns all of the data from the bottle', function() {
    bottle.set(key, data).set('other_key', data);

    expect(bottle.all()).toEqual({"key": data, "other_key": data});
  });

  it('calls an api if .api', function() {
    bottle.api = api;
    bottle.get('derp', function(result) {
      expect(result.data).toBe(otherData);
    })
  });
});
