'use strict';
angular.module('bottle.opener')
  .provider('$bottleCache', function(){
    var cache = {};

    function _get(key) {
      return localStorage.getItem(key);
    }

    function _set(key, data) {
      localStorage.setItem(key, data);
      return data;
    }

    this.$get = [function() {
      return new function() {

        this.get = function(key, slug) {
          if(angular.isDefined(cache[key])) {
            cache[key] = angular.fromJson(_get(key) || _set(key, '{}'));
          }

          if(angular.isDefined(slug)) {
            return cache[key][slug];
          } else {
            return cache[key];
          }
        };

        this.set = function(key, json, slug) {
          if(angular.isDefined(slug)) {
            cache[key][slug] = json;
          } else {
            cache[key] = json;
          }

          _set(key, angular.toJson(cache[key]));
        };
      }
    }];
  });
