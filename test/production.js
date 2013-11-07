var test = require('tape');
var Translator = require('../');

Translator.configure({
  locales: ['en', 'es'],
  development: false
});

test('on production (.development: false)', function (t) {
  var es = new Translator('es');

  t.deepEqual(es.config.store._cache, es.locales, 'fills cache');
  t.throws(french, 'throws with non-existent locale');
  t.end();

  function french () {
    var fr = new Translator('fr');
  }
});
