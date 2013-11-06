var test = require('tape');
var Translator = require('../');

Translator.configure({
  locales: ['en', 'es']
});

var f1 = {
  Hello: 'Hello',
  'Hello %s': 'Hello %s',
  'You got %s unread message': {
    one: 'You got %s unread message',
    other: 'You got %s unread messages'
  }
};

var f2 = {
  Hello: 'Hola',
  'Hello %s': 'Hola %s',
  'You got %s unread message': {
    one: 'Tienes %s mensaje sin leer',
    other: 'Tienes %s mensajes sin leer'
  }
};

test('loads .json files', function (t) {
  var en = new Translator();

  t.equal(typeof en, 'object', 'is object');
  t.equal(en.locale, 'en', 'default locale is correct');
  t.deepEqual(en.locales.en, f1, 'loaded all locales 1');
  t.deepEqual(en.locales.es, f2, 'loaded all locales 2');

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

test('handles non-existent strings', function (t) {
  var en = new Translator();

  // Clean up.
  setTimeout(function () {
    en.config.store.write('en', f1, en.config);
    t.end();
  }, 300);

  t.equal(en.__('Goodbye'), 'Goodbye', '__ simple, non-existent');
  t.equal(en.__('Goodbye %s', 'John'), 'Goodbye John', '__ vsprintf, non-existent');
  t.equal(en.__('You got %s cat', 'You got $s cats', 1), 'You got 1 cat', '__n, non-existent');
});

test('configure', function (t) {
  Translator.configure({
    extra: true
  });

  var en = new Translator();

  t.equal(en.config.dir, './locales', 'defaults are there');
  t.equal(en.config.extra, true, 'takes extra options');
  
  en.config.silent = false;
  t.throws(query, '.silent: false, throws');

  t.end();

  function query () {
    return en.__('Not there');
  }
});

// Should warn to console: 'Locale fr not available, using default (en)'
// (don't know how to better test)

  console.log('Warning about fr locale not available:');
  new Translator('fr');