'use strict';

// TODO:
// - Throw an exception if key isn't defined
// - Add cache busting to url fields?

angular.module('bottle.opener', ['crockford.monad'])
  .provider('$bottle', function () {

    // $bottleProvider
    var app = this;

    app.apiUrls = {};

    app.setApiUrl = function(key, api) {
      app.apiUrls[key] = api;
    }

    // private
    function _formatUrl(apiUrl, slug) {
      return apiUrl.split(':slug').join(slug);
    }

    // $bottle
    this.$get = ['$http', '$q', '$bottleCache', '$monad', function($http, $q, $bottleCache, $monad) {

      function get(key, slug) {
        var data, deferred, url, apiUrl;

        apiUrl = app.apiUrls[key];
        deferred = $q.defer();

        if (data = $bottleCache.get(key, slug)) {
          deferred.resolve({data: data});
        }
        else if(angular.isString(apiUrl)) {
          url = _formatUrl(apiUrl, slug);
          $http.get(url).then(deferred.resolve, deferred.reject);
        }
        else {
          deferred.reject({});
        }

        return deferred.promise;
      }

      function clean(key) {
        $bottleCache.set(key, angular.fromJson('{}'));
      }

      return $monad()
        .lift('clean', clean)
        .lift_value('get', get)

        .lift('set', $bottleCache.set)
        .lift_value('all', $bottleCache.get)
    }];

  });
