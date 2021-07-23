const fs = require('fs');
const path = require('path');

const dartSasspkg = JSON.parse(
  fs.readFileSync('./node_modules/dart-sass/package.json').toString()
);
const dartSassloc = path.resolve(
  path.join('./node_modules/dart-sass', dartSasspkg.main)
);

const libLoc = `lib/dartSass-${dartSasspkg.version}.js`;

try {
  fs.mkdirSync('lib');
} catch (e) {
  /* */
}
fs.copyFileSync(dartSassloc, libLoc);

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
