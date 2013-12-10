'use strict';

angular.module('bottle.opener', [])
  .service('$bottle', function () {
    return function(key) {
      var storage;

      function _get() {
        return localStorage.getItem(key);
      }

      function _set(data) {
        return localStorage.setItem(key, data);
      }

      function initialize() {
        storage = angular.fromJson(_get());
      }

      function set(slug, json) {
        storage[slug] = json;
        _set(angular.toJson(storage));
      }

      function get(slug) {
        return storage[slug];
      }

      _get() || _set("{}");

      initialize();

      return {
        initialize: initialize,
        set: set,
        get: get
      };
    }
  });

