'use strict';

describe('Service: $expiryEvaluator', function () {
  var $expiryEvaluator, $provide;

  beforeEach(module('bottle.opener'));

  beforeEach(inject(function (_$expiryEvaluator_) {
    $expiryEvaluator = _$expiryEvaluator_;
  }));

  function _sharedExample(a, b, condition) {
    var storage, result;

    storage = {a: a, b: b};

    result = $expiryEvaluator(storage, condition);

    expect(result).toEqual({a: a});
  };

  it('compares numbers', function () {
    _sharedExample(
      {count: 5},
      {count: 3},
      ":count < 4"
    );
  });

  it('compares dates', function() {
    _sharedExample(
      {expires_at: 'Dec 20 2013'},
      {expires_at: 'Dec 10 2013'},
      "new Date(':expires_at') < new Date('Dec 15 2013')"
    );
  });

  it('has a :now helper', function() {
    _sharedExample(
      {expires_at: 'Dec 20 2099'},
      {expires_at: 'Dec 10 2000'},
      "new Date(':expires_at') < :now"
    )
  });

  it('has a :this helper', function() {
    _sharedExample(
      5,
      3,
      ":this < 4"
    );
  });
});

