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

      function initialize() {
        storage = angular.fromJson(_get());
        return api;
      }

      function set(slug, json) {
        storage[slug] = json;
        _set(angular.toJson(storage));
        return api;
      }

      function get(slug) {
        return storage[slug];
      }

      _get() || _set("{}");

      initialize();

      api = {
        initialize: initialize,
        set: set,
        get: get
      };

      return api;
    }
  });

