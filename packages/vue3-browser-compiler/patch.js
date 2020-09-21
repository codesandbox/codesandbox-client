const fs = require('fs');

const source = fs
  .readFileSync('./lib/index.js')
  .toString()
  .replace(`require('consolidate')`, '{}');
fs.writeFileSync('./lib/index.js', source);
