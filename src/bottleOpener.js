'use strict';

angular.module('bottle.opener', [])
  .provider('$bottle', function () {

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

    this.$get = ['$http', '$q', function($http, $q) {

      function Bottle(key, opts) {
        opts || (opts = {});

        this.key = key;
        this.api = opts.api;
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
        var data, deferred, url;

        deferred = $q.defer();

        if (data = this.storage[slug]) {
          deferred.resolve({data: data});
        }
        else if(typeof this.api != 'undefined') {
          url = _formatUrl(this.api, slug);
          $http.get(url).then(deferred.resolve);
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
