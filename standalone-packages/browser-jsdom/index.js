const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const jsdompkg = JSON.parse(
  fs.readFileSync('./node_modules/jsdom/package.json').toString()
);
const jsdomloc = path.resolve(path.join('./node_modules/jsdom', jsdompkg.main));

const outLoc = `out/jsdom-${jsdompkg.version}.js`;
const outMinLoc = `out/jsdom-${jsdompkg.version}.min.js`;
cp.execSync(`node_modules/.bin/browserify -s JSDOM ${jsdomloc} > ${outLoc}`);
cp.execSync(`node_modules/.bin/terser ${outLoc} > ${outMinLoc}`);
