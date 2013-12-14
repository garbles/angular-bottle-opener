'use strict';

angular.module('bottle.opener')
  .provider('$expiryEvaluator', function () {

    function _findVariables(string) {
      return string.match(/(\:[a-zA-Z0-9\-_]+)/g);
    }

    function _assignVariable(variable, attrs) {
      var helpers, assigned;

      helpers = {
        ':now': "new Date()",
        ':this': attrs
      };

      assigned = (helpers[variable] || attrs[variable.substring(1)]);

      if(angular.isString(assigned)) {
        return assigned;
      } else {
        return angular.toJson(assigned);
      }
    }

    this.$get = ['$bottleCache', function($bottleCache) {

      function Expiry(storage, condition) {
        this.storage = storage;
        this.condition = condition;
        this.variables = _findVariables(condition);
        this.newStorage = {};
      }

      Expiry.prototype.substitute = function() {
        var _this = this;

        angular.forEach(this.storage, function(_, key) {
          _this.substituteForKey(key);
        });

        return this.newStorage;
      }

      Expiry.prototype.substituteForKey = function(key) {
        var parsedCondition, attrs;

        parsedCondition = this.condition;
        attrs = this.storage[key];

        angular.forEach(this.variables, function(variable, _) {
          var assigned = _assignVariable(variable, attrs);

          parsedCondition = parsedCondition.split(variable).join(assigned);
        });

        if(!eval(parsedCondition)) {
          this.newStorage[key] = attrs;
        }
      }

      return function(storage, condition) {
        var expiry = new Expiry(storage, condition);
        return expiry.substitute();
      }
    }];

  });
