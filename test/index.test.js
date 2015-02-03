/*!
* fs-cnpm - test/index.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var FSClient = require('..');
var path = require('path');
var fs = require('co-fs');

var dir = path.join(__dirname, 'dist');

var client;
describe('fs-cnpm', function () {
  describe('create', function () {
    it('should throw error without options', function () {
      (function () {
        FSClient();
      }).should.throw('need present options.dir');
    });

    it('should throw error without options.dir', function () {
      (function () {
        FSClient({});
      }).should.throw('need present options.dir');
    });

    it('should create client ok', function () {
      client = FSClient({dir: dir});
      client.dir.should.equal(dir);
    });
  });

  describe('uploadBuffer()', function () {
    it('should upload ok', function* () {
      var res = yield client.uploadBuffer('hello', {key: 'hello'});
      res.key.should.equal('hello');
      (yield fs.readFile(path.join(dir, 'hello'), 'utf8')).should.equal('hello');

      var res = yield client.uploadBuffer('hello', {key: '/a/b/c/d/e/f/g.txt'});
      res.key.should.equal('/a/b/c/d/e/f/g.txt');
      (yield fs.readFile(path.join(dir, '/a/b/c/d/e/f/g.txt'), 'utf8')).should.equal('hello');

      var res = yield client.uploadBuffer('hello', {key: 'foo/-/foo-1.3.2.txt'});
      res.key.should.equal('foo/-/foo-1.3.2.txt');
      (yield fs.readFile(path.join(dir, 'foo/-/foo-1.3.2.txt'), 'utf8')).should.equal('hello');
    });
  });

  describe('upload()', function () {
    it('should upload ok', function* () {
      var res = yield client.upload(path.join(dir, 'hello'), {key: 'hello1'});
      res.key.should.equal('hello1');
      (yield fs.readFile(path.join(dir, 'hello1'), 'utf8')).should.equal('hello');
    });
  });

  describe('download()', function () {
    it('should download ok', function* () {
      var dest = path.join(dir, 'world');
      yield client.download('hello', dest);
      (yield fs.readFile(path.join(dir, 'world'), 'utf8')).should.equal('hello');
      yield fs.unlink(dest);
    });
  });

  describe('remove()', function () {
    it('should remove ok', function* () {
      yield client.remove('hello');
      yield client.remove('hello1');
      yield client.remove('foo/-/foo-1.3.2.txt');
      (yield fs.exists(path.join(dir, 'hello'))).should.equal(false);
      (yield fs.exists(path.join(dir, 'hello1'))).should.equal(false);
    });
  });
});
