'use strict';

// TODO:
// - Throw an exception if key isn't defined
// - Add cache busting to url fields?

angular.module('bottle.opener', [])
  .provider('$bottle', function () {

    // $bottleProvider
    var app = this;

    app.bottleCache = {};
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
    this.$get = ['$http', '$q', function($http, $q) {

      function Bottle(key) {
        this.key = key;

        if(typeof app.bottleCache[key] == 'undefined') {
          app.bottleCache[key] = angular.fromJson(_get(key) || _set(key, '{}'));
        }
      }

      Bottle.prototype.all = function() {
        return app.bottleCache[this.key];
      }

      Bottle.prototype.clean = function() {
        app.bottleCache[this.key] = angular.fromJson('{}');
        _set(this.key, '{}');

        return this;
      }

      Bottle.prototype.get = function(slug) {
        var data, deferred, url, apiUrl;

        apiUrl = app.apiUrls[this.key];
        deferred = $q.defer();

        if (data = app.bottleCache[this.key][slug]) {
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
        app.bottleCache[this.key][slug] = json;
        _set(this.key, angular.toJson(app.bottleCache[this.key]));

        return this;
      }

      return function(key, opts) {
        return new Bottle(key, opts);
      }
    }];

  });
