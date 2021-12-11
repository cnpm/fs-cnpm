'use strict';

const path = require('path');
const fs = require('mz/fs');
const mkdirp = require('mz-modules/mkdirp');

class LocalDiskClient {
  constructor(options) {
    if (!options || !options.dir) {
      throw new Error('need present options.dir');
    }
    this.dir = options.dir;
  }

  async upload(filepath, options) {
    const destpath = this._getpath(options.key);
    await this._ensureDirExists(destpath);
    const content = await fs.readFile(filepath);
    await fs.writeFile(destpath, content);
    return { key: options.key };
  }

  async uploadBuffer(content, options) {
    const filepath = this._getpath(options.key);
    await this._ensureDirExists(filepath);
    await fs.writeFile(filepath, content);
    return { key: options.key };
  }

  async appendBuffer(content, options) {
    const filepath = this._getpath(options.key);
    await this._ensureDirExists(filepath);
    await fs.appendFile(filepath, content);
    return { key: options.key };
  }

  // stream or undefined
  async createDownloadStream(key) {
    const filepath = this._getpath(key);
    if (await fs.exists(filepath)) {
      return fs.createReadStream(filepath);
    }
  }

  // bytes or undefined
  async readBytes(key) {
    const filepath = this._getpath(key);
    if (await fs.exists(filepath)) {
      return await fs.readFile(filepath);
    }
  }

  async download(key, savePath) {
    const filepath = this._getpath(key);
    const content = await fs.readFile(filepath);
    await fs.writeFile(savePath, content);
  }

  async remove(key) {
    const filepath = this._getpath(key);
    if (await fs.exists(filepath)) {
      await fs.unlink(filepath);
    }
  }

  async _ensureDirExists(filepath) {
    return await mkdirp(path.dirname(filepath));
  }

  async list(prefix) {
    const destpath = this._getpath(prefix);
    return await fs.readdir(destpath);
  }

  _getpath(key) {
    return path.join(this.dir, key);
  }
}

module.exports = LocalDiskClient;
