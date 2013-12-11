'use strict';

angular.module('bottle.opener', [])
  .service('$bottle', function () {
    function Bottle(args) {
      this.key = args.key;
      this.storage = angular.fromJson(this._get());
      this;
    }

    Bottle.prototype._get = function() {
      return localStorage.getItem(this.key);
    }

    Bottle.prototype._set = function(data) {
      return localStorage.setItem(this.key, data);
    }

    Bottle.prototype.all = function() {
      return this.storage;
    }

    Bottle.prototype.clean = function() {
      this.storage = angular.fromJson("{}");
      this._set("{}");
      return this;
    }

    Bottle.prototype.get = function(slug) {
      return this.storage[slug];
    }

    Bottle.prototype.set = function(slug, json) {
      this.storage[slug] = json;
      this._set(angular.toJson(this.storage));
      return this;
    }

    return function(args) {
      return new Bottle(args);
    }
  });
