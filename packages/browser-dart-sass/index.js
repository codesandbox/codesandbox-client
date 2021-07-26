const fs = require('fs');
const path = require('path');

const sassLocation = require.resolve('sass');
const libLoc = path.join(__dirname, 'lib/index.js');

try {
  fs.mkdirSync('lib');
} catch (e) {
  /* */
}
fs.copyFileSync(sassLocation, libLoc);

const file = fs
  .readFileSync(libLoc)
  .toString()
  .replace('self.readline = require("readline");', '')
  .replace(`self.chokidar = require("chokidar");`, ``)
  .replace(
    'var dartNodePreambleSelf = typeof global !== "undefined" ? global : window;',
    'var dartNodePreambleSelf = window'
  )
  .replace(
    `var self = Object.create(dartNodePreambleSelf);`,
    `var self = window;`
  );
fs.writeFileSync(libLoc, file);
