'use strict';

angular.module('bottle.opener', [])
  .service('$bottle', function () {
    return function(key) {
      var storage;

      localStorage[key] || (localStorage[key] = "{}");

      function initialize() {
        storage = angular.fromJson(localStorage[key]);
      }

      function store(slug, json) {
        storage[slug] = json;
        localStorage[key] = angular.toJson(storage);
      }

      function retrieve(slug, callback) {
        if (storage[slug]) {
          return storage[slug];
        } else if (typeof callback == 'function') {
          return callback();
        }
      }

      initialize();

      return {
        initialize: initialize,
        store: store,
        retrieve: retrieve
      };
    }
  });

