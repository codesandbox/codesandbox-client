#!/usr/bin/env node

// Generates `run.ts` for unit tests.

import * as fs from 'fs';
import * as path from 'path';

function generateRunFile() {
  let tests = '', importsStringified: string, testImports: string[] = [];
  function processDir(dir: string) {
    fs.readdirSync(dir).forEach(function(file) {
      let filePath = path.resolve(dir, file),
        relPath = path.relative(path.resolve('test/harness'), filePath);
      if (fs.statSync(filePath).isFile()) {
        let name = path.basename(relPath).replace(/-/g, '_');
        name = name.slice(0, name.length - 3);
        switch (path.extname(file)) {
        case '.ts':
          let modPath = relPath.slice(0, relPath.length - 3).replace(/\\/g, '/');
          testImports.push(`import ${name} from '${modPath}';`);
          tests += `'${file}': ${name},`;
          break;
        case '.js':
          let jsModPath = relPath.slice(0, relPath.length - 3).replace(/\\/g, '/');
          testImports.push(`const ${name}Emscripten = require('${jsModPath}');`);
          tests += `'${file}': ${name}Emscripten,`;
          break;
        default:
          break;
        }
      } else {
        tests += '\'' + file + '\':{';
        processDir(filePath);
        tests += '},';
      }
    });
    // Remove trailing ','.
    tests = tests.slice(0, tests.length - 1);
  }
  processDir('test/tests');
  const factoryList: string[] = [];
  importsStringified = fs.readdirSync('test/harness/factories')
    .filter(function(file) {
      return file.slice(file.length-11) === '_factory.ts';
    })
    .map(function(file) {
      var name = file.slice(0, file.length - 11);
      factoryList.push(name);
      return `import ${name} from './factories/${file.slice(0, file.length - 3)}';`;
    }).concat(testImports).join('\n');

  fs.writeFileSync('test/harness/run.ts',
    Buffer.from(fs.readFileSync('test/harness/run.tstemplate')
      .toString()
      .replace(/\/\*IMPORTS\*\//g, importsStringified)
      .replace(/\/\*FACTORIES\*\//g, factoryList.join(', '))
      .replace(/\/\*TESTS\*\//g, tests), 'utf8'));
}

generateRunFile();
