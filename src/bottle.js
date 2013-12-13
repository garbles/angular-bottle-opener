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

    function _get(key) {
      return localStorage.getItem(key);
    }

    function _set(key, data) {
      localStorage.setItem(key, data);
      return data;
    }

    // $bottle
    this.$get = ['$http', '$q', '$bottleCache', function($http, $q, $bottleCache) {

      function Bottle(key) {
        this.key = key;

        if(typeof $bottleCache[key] == 'undefined') {
          $bottleCache[key] = angular.fromJson(_get(key) || _set(key, '{}'));
        }
      }

      Bottle.prototype.all = function() {
        return $bottleCache[this.key];
      }

      Bottle.prototype.clean = function() {
        $bottleCache[this.key] = angular.fromJson('{}');
        _set(this.key, '{}');

        return this;
      }

      Bottle.prototype.get = function(slug) {
        var data, deferred, url, apiUrl;

        apiUrl = app.apiUrls[this.key];
        deferred = $q.defer();

        if (data = $bottleCache[this.key][slug]) {
          deferred.resolve({data: data});
        }
        else if(typeof apiUrl != 'undefined') {
          url = _formatUrl(apiUrl, slug);
          $http.get(url).then(deferred.resolve, deferred.reject);
        }
        else {
          deferred.reject({});
        }

        return deferred.promise;
      }

      Bottle.prototype.set = function(slug, json) {
        $bottleCache[this.key][slug] = json;
        _set(this.key, angular.toJson($bottleCache[this.key]));

        return this;
      }

      return function(key, opts) {
        return new Bottle(key, opts);
      }
    }];

  });
