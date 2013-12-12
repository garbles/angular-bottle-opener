'use strict';

angular.module('bottle.opener', [])
  .provider('$bottle', function () {
    this.$get = ['$http', '$q', function($http, $q) {

      function Bottle(args) {
        this.key = args.key;
        this.api = args.api;
        this.storage = angular.fromJson(_get(this.key) || _set(this.key, "{}"));
      }

      Bottle.prototype.all = function() {
        return this.storage;
      }

      Bottle.prototype.clean = function() {
        this.storage = angular.fromJson("{}");
        _set(this.key, "{}");

        return this;
      }

      Bottle.prototype.get = function(slug) {
        var data, deferred;

        deferred = $q.defer();

        if (data = this.storage[slug]) {
          deferred.resolve({data: data});
        }
        else if(typeof this.api != 'undefined') {
          $http.get(this.api + slug).then(deferred.resolve);
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

      function _get(key) {
        return localStorage.getItem(key);
      }

      function _set(key, data) {
        localStorage.setItem(key, data);
        return data;
      }

      return function(args) {
        return new Bottle(args);
      }
    }];

  });
