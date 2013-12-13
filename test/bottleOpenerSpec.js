'use strict';

describe('Service: $bottle', function () {
  var $bottle, $httpBackend, bottle, key, data, otherData, api;

  key = 'key';
  data = {a:1};
  otherData = {b: 1}
  api = 'http://www.example.com/api/';

  beforeEach(module('bottle.opener'));

  beforeEach(inject(function (_$bottle_, _$httpBackend_) {
    $bottle = _$bottle_;
    bottle = $bottle('test');
    bottle.clean();

    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', api + 'success').respond(otherData);
    $httpBackend.when('GET', api + 'failure').respond(404);
  }));

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

  it('initializes local storage', function () {
    expect(localStorage.getItem('test')).toBe('{}');
  });

  it('stores and retrieves local storage data', function() {
    bottle.set(key, data);

    bottle.get(key).then(function(result) {
      expect(result.data).toEqual(data);
    });

  });

  it('returns an empty object if the slug is not found', function() {
    bottle.get('derp').then(function(result) {
      expect(result.data).toBeUndefined();
    });
  });

  it('allows you to chain commands together', function() {
    bottle.set(key, data);

    bottle.get(key).then(function(result) {
      expect(result.data).toEqual(data);
    });
  });

  it('returns all of the data from the bottle', function() {
    bottle.set(key, data).set('other_key', data);

    expect(bottle.all()).toEqual({"key": data, "other_key": data});
  });

  it('calls an api if .api', function() {
    var resultData;
    var key = 'success';
    bottle.api = api + ':slug';

    $httpBackend.expectGET(api + key);

    bottle.get(key).then(function(result){
      resultData = result.data;
    });

    $httpBackend.flush();
    expect(resultData).toEqual(otherData);
  });


  it('calls an api if .api', function() {
    var resultStatus;
    var key = 'failure';
    bottle.api = api + ':slug';

    bottle.get(key).then(function(result) {
      resultStatus = result.status;
    }, function(result){
      resultStatus = result.status;
    });

    $httpBackend.flush();

    // do this outside of the function so that it's
    // guaranteed to be checked.
    expect(resultStatus).toBe(404);
  });
});
