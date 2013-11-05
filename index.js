var vsprintf = require('sprintf').vsprintf;
var store = require('./store');

var defaults = {
  locales: ['en'],
  dir: './locales',
  store: store,
  write: true,
  development: (process.env.NODE_ENV !== 'production') 
};



// todo:
// - handle non-existent keys (append), write to disk when needed: check fn
// - function to add # methods to some object (mixin?)

module.exports = Translator;

function Translator (locale) {
  var locales = Translator.config.locales;
  var fallback = locales[0];

  this.locales = Object.create(null);
  this.config = Translator.config;
  this.store = Translator.config.store;

  if (locale && !~locales.indexOf(locale)) {
    if (!this.config.development) {
      throw new Error('Locale not available: ' + locale);
    }
    console.warn('Locale %s not available, using default (%s)', locale, fallback);
  }
  
  this.locale = locale || fallback;

  locales.forEach(function (locale) {
    this.locales[locale] = this.store.read(locale, this.config);
  }, this);
}

Translator.config = defaults;

Translator.configure = function configure (options) {
  if (typeof options !== 'object') return;

  for (var key in options) {
    Translator.config[key] = options[key];
  }
};

Translator.prototype.__ =
Translator.prototype.__n = 
Translator.prototype.translate = translate;

function translate (a, b, c) {
  var current = this.locale;
  var args = [].slice.call(arguments, 0);
  var value;

  // __('Hello')
  if (args.length === 1) {
    return check.call(this, this.locales[current][a], args);
  }

  // __('Hello %s', 'Foo')
  if (args.length === 2) {
    value = check.call(this, this.locales[current][a], args);
    b = (typeof b === 'string') ? [b] : b;
    return vsprintf(value, b);
  }

  // __('%s cat', '%s cats', 1)
  if (args.length === 3) {
    value = check.call(this, this.locales[current][a], args);
    value = parseInt(c, 10) === 1 ? value.one : value.other;
    return vsprintf(value, [c]);
  }
}

function check (value, args) {
  return value;

  if (args.length === 1) {
  }
  if (args.length === 2) {
  }
  if (args.length === 3) {
  }
}



