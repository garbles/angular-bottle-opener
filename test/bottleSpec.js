'use strict';

describe('Service: $bottle', function () {
  var $bottle, $httpBackend, bottle, bottleName,
  slug, data, otherData, api, $bottleProvider;

  bottleName = 'test';
  slug = 'slug';
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
    bottle.set(data, slug);

    bottle.get(slug).then(function(result) {
      expect(result.data).toEqual(data);
    });

  });

  it('returns an empty object if the slug is not found', function() {
    bottle.get('derp').then(function(result) {
      expect(result.data).toBeUndefined();
    });
  });

  it('allows you to chain commands together', function() {
    bottle.set(data, slug);

    bottle.get(slug).then(function(result) {
      expect(result.data).toEqual(data);
    });
  });

  it('returns all of the data from the bottle', function() {
    bottle.set(data, slug).set(data, 'other-slug');

    expect(bottle.all()).toEqual({"slug": data, "other-slug": data});
  });

  it('calls an api if .api', function() {
    var resultData;
    var slug = 'success';

    $bottleProvider.setApiUrl(bottleName, api + ':slug');
    $httpBackend.expectGET(api + slug);

    bottle.get(slug).then(function(result){
      resultData = result.data;
    });

    $httpBackend.flush();
    expect(resultData).toEqual(otherData);
  });


  it('calls an api if .api', function() {
    var resultStatus;
    var slug = 'failure';
    $bottleProvider.setApiUrl(bottleName, api + ':slug');

    bottle.get(slug).then(function(result) {
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

    bottle.set(data, slug);

    bottle2.get(slug).then(function(result){
      expect(result.data).toEqual(data);
    });
  });
});
