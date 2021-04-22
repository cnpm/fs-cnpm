'use strict';

const FSClient = require('..');
const path = require('path');
const fs = require('mz/fs');
const assert = require('assert');

const dir = path.join(__dirname, 'dist');

let client;
describe('fs-cnpm', () => {
  describe('create', () => {
    it('should throw error without options', () => {
      assert.throws(() => {
        new FSClient();
      }, /need present options\.dir/);
    });

    it('should throw error without options.dir', () => {
      assert.throws(() => {
        new FSClient({});
      }, /need present options\.dir/);
    });

    it('should create client ok', () => {
      client = new FSClient({ dir });
      assert(client.dir === dir);
    });
  });

  describe('uploadBuffer()', () => {
    it('should upload ok', async () => {
      let res = await client.uploadBuffer('hello', { key: 'hello/bar.tgz' });
      assert(res.key === 'hello/bar.tgz');
      assert.equal(await fs.readFile(path.join(dir, res.key), 'utf8'), 'hello');

      res = await client.uploadBuffer('hello1', { key: '/a/b/c/d/e/f/g.txt' });
      assert(res.key === '/a/b/c/d/e/f/g.txt');
      assert.equal(await fs.readFile(path.join(dir, res.key), 'utf8'), 'hello1');

      res = await client.uploadBuffer('hello2', { key: '/foo/-/foo-1.3.2.txt' });
      assert(res.key === '/foo/-/foo-1.3.2.txt');
      assert.equal(await fs.readFile(path.join(dir, res.key), 'utf8'), 'hello2');
    });
  });

  describe('upload()', () => {
    it('should upload ok', async () => {
      const res = await client.upload(__filename, { key: 'hello/upload.js' });
      assert(res.key === 'hello/upload.js');
      assert.equal(await fs.readFile(path.join(dir, res.key), 'utf8'), await fs.readFile(__filename, 'utf8'));
    });
  });

  describe('download()', () => {
    it('should download ok', async () => {
      await client.uploadBuffer('hello bar', { key: 'hello/download-bar.tgz' });
      const dest = path.join(dir, 'world');
      await client.download('hello/download-bar.tgz', dest);
      assert.equal(await fs.readFile(path.join(dir, 'world'), 'utf8'), 'hello bar');
      await fs.unlink(dest);
    });
  });

  describe('remove()', () => {
    it('should remove ok', async () => {
      await client.uploadBuffer('hello bar', { key: 'hello/download-bar.tgz' });
      await client.uploadBuffer('hello bar', { key: '/foo/-/foo-1.3.2.txt' });
      await client.remove('hello/download-bar.tgz');
      await client.remove('/foo/-/foo-1.3.2.txt');
      await client.remove('not-exists-dir/foo/-/foo-1.3.2.txt');
      assert.equal(await fs.exists(path.join(dir, 'hello/download-bar.tgz')), false);
      assert.equal(await fs.exists(path.join(dir, 'foo/-/foo-1.3.2.txt')), false);
    });
  });

  describe('list()', () => {
    beforeEach(async () => {
      await client.upload(__filename, { key: 'hello/upload.js' });
    });

    it('should upload ok', async () => {
      const files = await client.list('hello');
      assert.deepStrictEqual(files, [
        'upload.js',
      ]);
    });
  });
});
