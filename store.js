var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var cache = Object.create(null);
var counter = 0;



module.exports = {
  read: readFile,
  write: writeFile
};

function readFile (locale, options, callback) {
  var filepath = normalize(options.dir, locale);
  var data = {};

  if (!options.development && cache[locale])
    return callback(null, cache[locale]);

  try {
    data = require(filepath);
    // data = fs.readFileSync(filepath, { encoding: 'utf8' });
    // data = JSON.parse(data);
  } catch (err) {
    if (!options.development) error(err, 'Locale file not found');
    createFile(filepath, options);
  }

  if (!options.development) cache[locale] = data;
  callback(null, data);
}

function writeFile (locale, data, options) {
  var filepath = normalize(options.dir, locale);
  var tmp = filepath + '.tmp' + ++counter;
  data = JSON.stringify(data, null, '\t');

  fs.writeFile(tmp, data, rename);

  function rename (err) {
    if (err) error(err, 'Unable to write file at ' + tmp);
    
    fs.rename(tmp, filepath, function (err) {
      if (err) error(err, 'Unable to rename file to ' + filepath);
    });
  }
}

function createFile (filepath, options) {
  var data = Object.create(null);
  var dir = normalize(options.dir);

  mkdirp(dir, function (err, made) {
    if (err) error(err, 'Unable to create directory ' + dir);

    fs.writeFile(filepath, JSON.stringify(data), function (err) {
      if (err) error(err, 'Unable to create locale file at ' + filepath);
    });
  });
  
  return data;
}

function normalize (dir, locale) {
  if (arguments.length === 1) return path.join(__dirname, dir);
  return path.join(__dirname, dir, locale + '.json');
}

function error (err, message) {
  console.error(message);
  throw err;
}