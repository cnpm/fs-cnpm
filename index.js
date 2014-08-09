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

Client.prototype.uploadBuffer = function* (content, options) {
  var filepath = this._getpath(options.key);
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

Client.prototype._getpath = function (key) {
  key = key.replace(/\//g, '-').replace(/\\/g, '_');
  return path.join(this.dir, key);
};
