const fs = require('fs');
const _ = require('lodash');
const deps = require('./deps.json');

let st = '';
const depsizes = [];

deps.forEach((path, i) => {
  const resolvedFile = require.resolve(
    '../' + path.replace('http://localhost:3000', '')
  );

  // st += `import a${i} from "${resolvedFile}"\n`;

  const depst = fs.readFileSync(resolvedFile).toString();
  depsizes.push({ size: depst.length, file: resolvedFile });

  st += depst + '\n\n';
});
fs.writeFileSync('./genee.js', st);

console.log(_.sortBy(depsizes, o => -o.size));
