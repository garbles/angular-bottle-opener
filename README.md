# angular-bottle-opener

Store and retrieve object data from your browser's localStorage with bottleOpener.
Its motivation is an attempt to minimize the number of http requests made to your
server during a page load by storing non-sensitive, rarely/never-updated data on the client's localStorage.

### WARNING!!

This library is still in the very very early stages and I'm constantly changing my mind on how it should work.
Please, if you're interested in trying it out, be prepared for changes!

## Installing

You can install this as a bower package with `bower install angular-bottle-opener`
or add it to your bower.json file.

## Example Use

You can store key-value pairs (or key-object pairs if you prefer) in your localStorage by initializing a new bottle and calling `set`.

```javascript
angular.module('app')
  .controller('ctrl', function($scope,$bottle) {
    $scope.data = {'test': 'data'};

    // find or create a bottle with the name `example`
    var bottle = $bottle('example');

    bottle.set($scope.data, 'bacon'); // => {'test': 'data'}
  });
```

Retrieving data is accomplished with `get` and always returns a promise.

```javascript
angular.module('app')
  .controller('ctrl', function($scope, $bottle) {
    var bottle = $bottle('example');

    bottle.get('bacon').then(function(result){

      // once the promise is resolved, assign it to something.
      $scope.otherData = result.data; // => {'test': 'data'}
    });
  });
```

You can take this a step further by specifying an API endpoint so that if `get` can't locate the data
in your localStorage, it will attempt to fetch it from the server.

```javascript
angular.module('app')
  .config(function($bottleProvider){
    // :slug param required
    $bottleProvider.setApi('example',  'http://www.example.com/api/:slug');
  })
  .controller('ctrl', function($scope, $bottle) {
    var bottle = $bottle('example');

    // will create an http request for http://www.example.com/api/other-bacon
    bottle.get('other-bacon').then(function(result) {
      $scope.otherData = result.data; // => some other data?
    });
  });
```

## License

MIT
