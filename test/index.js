var test = require('tape');
var Translator = require('../');

Translator.configure({
  locales: ['en', 'es']
});

test('loads .json files', function (t) {
  var en = new Translator();

  var expected1 = {
    Hello: 'Hello',
    'Hello %s': 'Hello %s',
    'You got %s unread message': {
      one: 'You got %s unread message',
      other: 'You got %s unread messages'
    }
  };

  var expected2 = {
    Hello: 'Hola',
    'Hello %s': 'Hola %s',
    'You got %s unread message': {
      one: 'Tienes %s mensaje sin leer',
      other: 'Tienes %s mensajes sin leer'
    }
  };

  t.equal(typeof en, 'object', 'is object');
  t.equal(en.locale, 'en', 'default locale is correct');
  t.deepEqual(en.locales.en, expected1, 'loaded all locales 1');
  t.deepEqual(en.locales.es, expected2, 'loaded all locales 2');

  t.end();
});

test('translates', function (t) {
  var es = new Translator('es');
  
  t.equal(es.__('Hello'), 'Hola', '__ simple');
  t.equal(es.__('Hello %s', 'John'), 'Hola John', '__ vsprintf');
  t.equal(es.__('You got %s unread message', 'You got $s unread messages', 1), 'Tienes 1 mensaje sin leer', '__n singular');
  t.equal(es.__('You got %s unread message', 'You got $s unread messages', 2), 'Tienes 2 mensajes sin leer', '__n plurar');
  t.equal(es.__('You got %s unread message', 'You got $s unread messages', 0), 'Tienes 0 mensajes sin leer', '__n zero');
  
  t.end();
});

// Should warn to console: 'Locale fr not available, using default (en)'
// (don't know how to better test)

console.log('Warning about fr locale not available:');
new Translator('fr')



// Missing tests:
// - .write: bool
// - .silent: bool
// everything on 'production'