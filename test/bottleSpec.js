'use strict';

describe('Service: $bottle', function () {
  var $bottle, $httpBackend, bottle, bottleName,
  key, data, otherData, api, $bottleProvider;

  bottleName = 'test';
  key = 'key';
  data = {a:1};
  otherData = {b: 1}
  api = 'http://www.example.com/api/';

  beforeEach(function(){
    angular.module('test.config', function(){})
      .config(function(_$bottleProvider_){
        $bottleProvider = _$bottleProvider_;
      });

    module('bottle.opener', 'test.config');
  });


  beforeEach(inject(function (_$bottle_, _$httpBackend_) {
    $bottle = _$bottle_;

    bottle = $bottle(bottleName);
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
    expect(localStorage.getItem(bottleName)).toBe('{}');
  });

  it('stores and retrieves local storage data', function() {
    bottle.set(data, key);

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
    bottle.set(data, key);

    bottle.get(key).then(function(result) {
      expect(result.data).toEqual(data);
    });
  });

  it('returns all of the data from the bottle', function() {
    bottle.set(data, key).set(data, 'other-key');

    expect(bottle.all()).toEqual({"key": data, "other-key": data});
  });

  it('calls an api if .api', function() {
    var resultData;
    var key = 'success';

    $bottleProvider.setApiUrl(bottleName, api + ':slug');
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
    $bottleProvider.setApiUrl(bottleName, api + ':slug');

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

  it('sets a bottle cache at the app level', function() {
    var resultData, bottle2;

    bottle2 = $bottle(bottleName);

    bottle.set(data, key);

    bottle2.get(key).then(function(result){
      expect(result.data).toEqual(data);
    });
  });

  it('returns the entire bottle if the slug is not specified', function() {
    bottle.set(data, key);
    bottle.set(otherData, 'other-' + key);

    bottle.get().then(function(result){
      expect(result.data).toEqual({"key": data, "other-key": otherData});
    });
  });
});
