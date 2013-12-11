'use strict';

angular.module('bottle.opener', [])
  .service('$bottle', function () {

    function _get(key) {
      return localStorage.getItem(key);
    }

    function _set(key, data) {
      localStorage.setItem(key, data);
      return data;
    }

    function Bottle(args) {
      this.key = args.key;
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
      return this.storage[slug];
    }

    Bottle.prototype.set = function(slug, json) {
      this.storage[slug] = json;
      _set(this.key, angular.toJson(this.storage));
      return this;
    }

    return function(args) {
      return new Bottle(args);
    }
  });
