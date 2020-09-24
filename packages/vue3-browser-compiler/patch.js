const fs = require('fs');

const source = fs
  .readFileSync('./lib/index.js')
  .toString()
  .replace(`require('consolidate')`, '{}') // Don't use consolidate
  .replace(/load = require/g, 'load'); // Replace load = require, which is used for loading preprocessors. We include our own

fs.writeFileSync('./lib/index.js', source);
