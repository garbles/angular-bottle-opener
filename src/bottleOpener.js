'use strict';

// TODO:
// - Make the first argument of $bottle the key and the second options
// - Throw an exception if key isn't defined
// - Create a 'expire' method which will clear entries if they don't meet some criteria
// - Handle api call fails
// - Add cache busting to url fields?

angular.module('bottle.opener', [])
  .provider('$bottle', function () {

    // $bottleProvider
    var app = this;

    this.apiUrls = {};

    this.setApiUrl = function(key, api) {
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
    this.$get = ['$http', '$q', function($http, $q) {

      function Bottle(key) {
        this.key = key;
        this.storage = angular.fromJson(_get(this.key) || _set(this.key, '{}'));
      }

      Bottle.prototype.all = function() {
        return this.storage;
      }

      Bottle.prototype.clean = function() {
        this.storage = angular.fromJson('{}');
        _set(this.key, '{}');

        return this;
      }

      Bottle.prototype.get = function(slug) {
        var data, deferred, url, apiUrl;

        apiUrl = app.apiUrls[this.key];
        deferred = $q.defer();

        if (data = this.storage[slug]) {
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
        this.storage[slug] = json;
        _set(this.key, angular.toJson(this.storage));

        return this;
      }

      return function(key, opts) {
        return new Bottle(key, opts);
      }
    }];

  });
