const fs = require('fs');
const path = require('path');
const packageJson = require('./package.json');

// Could also use require.resolve('dart-sass') but this seemed more reliable
const dartSassLoc = path.join(__dirname, 'sass.js');
const libLoc = `lib/dartSass-${packageJson.version}.js`;

try {
  fs.mkdirSync('lib');
} catch (e) {
  /* */
}
fs.copyFileSync(dartSassLoc, libLoc);

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
