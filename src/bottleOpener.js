'use strict';

angular.module('bottle.opener', [])
  .service('$bottle', function () {
    return function(key) {
      var storage, api;

      function _get() {
        return localStorage.getItem(key);
      }

      function _set(data) {
        return localStorage.setItem(key, data);
      }

      function all() {
        return storage;
      }

      function clean() {
        storage = {};
        _set("{}");
        return api;
      }

      function get(slug) {
        return storage[slug];
      }

      function initialize() {
        storage = angular.fromJson(_get());
        return api;
      }

      function set(slug, json) {
        storage[slug] = json;
        _set(angular.toJson(storage));
        return api;
      }

      _get() || _set("{}");

      initialize();

      api = {
        all: all,
        clean: clean,
        initialize: initialize,
        get: get,
        set: set
      };

      return api;
    }
  });

