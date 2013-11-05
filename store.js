var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var cache = Object.create(null);



module.exports = {
  create: createFile,
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
    if (!options.development) throw new Error('Locale file not found');
    createFile(filepath, options);
  }

  if (!options.development) cache[locale] = data;
  callback(null, data);
}

function writeFile (locale, data, options) {
  if (!options.write) return;

  var filepath = normalize(options.dir, locale);
  var tmp = filepath + '.tmp';
  data = JSON.stringify(data, null, '\t');

  fs.writeFile(tmp, data, rename);

  function rename (err) {
    if (err) throw new Error('Unable to write file at ' + filepath);
    
    fs.rename(tmp, filepath, function (err) {
      if (err) throw new Error('Unable to write file at ' + filepath);
    });
  }
}

function createFile (filepath, options) {
  if (!options.write) return;

  var data = Object.create(null);
  var dir = normalize(options.dir);

  mkdirp(dir, function (err, made) {
    if (err) throw new Error('Unable to create directory ' + dir);
    fs.writeFile(filepath, JSON.stringify(data), function (err) {
      if (err) throw new Error('Unable to create locale file at ' + filepath);
    });
  });
  
  return data;
}

function normalize (dir, locale) {
  if (arguments.length === 1) return path.join(__dirname, dir);
  return path.join(__dirname, dir, locale + '.json');
}