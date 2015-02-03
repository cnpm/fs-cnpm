/*!
 * fs-cnpm - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('co-fs');

/**
 * Expose `Client`
 */
module.exports = Client;

function Client(options) {
  if (!options || !options.dir) {
    throw new Error('need present options.dir');
  }

  if (!(this instanceof Client)) {
    return new Client(options);
  }
  this.dir = options.dir;
  mkdirp.sync(this.dir);
}

function ensureDirExists(filepath) {
  return function (callback) {
    mkdirp(path.dirname(filepath), callback);
  };
}

Client.prototype.upload = function* (filepath, options) {
  var destpath = this._getpath(options.key);
  yield ensureDirExists(destpath);
  var content = yield fs.readFile(filepath);
  yield fs.writeFile(destpath, content);
  return { key: options.key };
};

Client.prototype.uploadBuffer = function* (content, options) {
  var filepath = this._getpath(options.key);
  yield ensureDirExists(filepath);
  yield fs.writeFile(filepath, content);
  return { key: options.key };
};

Client.prototype.download = function* (key, savePath, options) {
  var filepath = this._getpath(key);
  var content = yield fs.readFile(filepath);
  yield fs.writeFile(savePath, content);
};

Client.prototype.remove = function* (key) {
  var filepath = this._getpath(key);
  yield fs.unlink(filepath);
};

/**
 * escape '/' and '\'
 */

Client.prototype._getpath = function (key) {
  return path.join(this.dir, key);
};
