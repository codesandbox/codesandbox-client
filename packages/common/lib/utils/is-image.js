'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const path = require('./path');
const imageExtensions = require('image-extensions/image-extensions.json');
const exts = new Set(imageExtensions);
exports.default = filepath =>
  exts.has(
    path
      .extname(filepath)
      .slice(1)
      .toLowerCase()
  );
