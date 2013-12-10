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

      function store(slug, json) {
        storage[slug] = json;
        _set(angular.toJson(storage));
      }

      function retrieve(slug, callback) {
        if (storage[slug]) {
          return storage[slug];
        } else if (typeof callback == 'function') {
          return callback();
        }
      }

      _get() || _set("{}");

      initialize();

      return {
        initialize: initialize,
        store: store,
        retrieve: retrieve
      };
    }
  });

