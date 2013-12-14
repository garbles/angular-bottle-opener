'use strict';

// TODO:
// - Helper methods
//   - :now
//   - :this

angular.module('bottle.opener')
  .provider('$expiryEvaluator', function () {

    //private functions
    function _substitute() {
      // make variable substitutions
    }

    this.$get = ['$bottleCache', function($bottleCache) {
      return function(key, conditionString) {
        var bottle = $bottleCache[key];

      }
    }];

  });
