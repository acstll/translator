var vsprintf = require('sprintf').vsprintf;
var store = require('./store');

var defaults = {
  locales: ['en'],
  silent: true,
  development: (process.env.NODE_ENV !== 'production'),
  store: store
};



module.exports = Translator;

function Translator (locale) {
  if (!this instanceof Translator) return new Translator(locale);

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
    var self = this;

    this.store.read(locale, this.config, function (err, data) {
      if (err) throw err;
      self.locales[locale] = data;
    });
  }, this);
}

Translator.config = defaults;

Translator.configure = function configure (options) {
  if (typeof options !== 'object') return;

  for (var key in options) {
    Translator.config[key] = options[key];
  }
};

Translator.prototype.mixin = function mixin (obj) {
  obj = obj || {};
  
  obj.t =
  obj.__ =
  obj.__n =
  obj.translate = this.translate.bind(this);

  return obj;
};

Translator.prototype.t =
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
  if (value) return value;

  var options = this.config;
  var current = this.locales[this.locale];
  var a = args[0];
  var b = args[1];
  var c = args[2];

  if (!options.silent) throw new Error('Translation not available for ' + args[0]);
  
  // Create non-existent key, 'write' while in development.

  if (args.length < 3) {
    current[a] = a;
    if (options.development) {
      this.store.write(this.locale, current, options);
    }
    return a;
  }

  if (args.length === 3) {
    current[a] = {
      one: a,
      other: b
    };
    if (options.development) {
      this.store.write(this.locale, current, options);
    }
    return current[a];
  }
}