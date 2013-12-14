'use strict';

// TODO:
// - Throw an exception if key isn't defined
// - Add cache busting to url fields?

angular.module('bottle.opener', [])
  .provider('$bottle', function () {

    // $bottleProvider
    var app = this;

    app.apiUrls = {};

    app.setApiUrl = function(key, api) {
      app.apiUrls[key] = api;
    }

    // private
    function _formatUrl(apiUrl, slug) {
      return apiUrl.split(':slug').join(slug);
    }

    // $bottle
    this.$get = ['$http', '$q', '$bottleCache', function($http, $q, $bottleCache) {

      function Bottle(key) {
        this.key = key;
      }

      Bottle.prototype.all = function() {
        return $bottleCache.get(this.key);
      }

      Bottle.prototype.clean = function() {
        return this.set(angular.fromJson('{}'));
      }

      Bottle.prototype.get = function(slug) {
        var data, deferred, url, apiUrl;

        apiUrl = app.apiUrls[this.key];
        deferred = $q.defer();

        if (data = $bottleCache.get(this.key, slug)) {
          deferred.resolve({data: data});
        }
        else if(angular.isString(apiUrl)) {
          url = _formatUrl(apiUrl, slug);
          $http.get(url).then(deferred.resolve, deferred.reject);
        }
        else {
          deferred.reject({});
        }

        return deferred.promise;
      }

      Bottle.prototype.set = function(json, slug) {
        $bottleCache.set(this.key, json, slug);
        return this;
      }

      return function(key) {
        return new Bottle(key);
      }
    }];

  });
