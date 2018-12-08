#! /usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

const parser = require('gitignore-parser');

const symLinks: {[dev: number]: {[ino: number]: boolean}} = {};
const ignoreFiles = ['.git'];

type FileTree = {[name: string]: FileTree | null};

let vscodeignores: {[path: string]: { denies: (p: string) => boolean } | null} = {}

function rdSync(dpath: string, tree: FileTree): FileTree {
  const files = fs.readdirSync(dpath);

  if (files.indexOf('.vscodeignore') > -1) {
    vscodeignores[dpath] = parser.compile(fs.readFileSync(path.join(dpath, '.vscodeignore'), 'utf8'));
  }

  const vscodeignorePath = Object.keys(vscodeignores).find(f => dpath.indexOf(f) === 0);
  const vscodeignore = vscodeignorePath ? vscodeignores[vscodeignorePath] : undefined;

  files.forEach((file) => {
    // ignore non-essential directories / files
    if (ignoreFiles.indexOf(file) !== -1 || file[0] === '.') {
      return;
    }
    const fpath = `${dpath}/${file}`;

    if (vscodeignore && vscodeignore.denies(fpath.replace(vscodeignorePath!, ''))) {
      return;
    }
    try {
      // Avoid infinite loops.
      const lstat = fs.lstatSync(fpath)
      if (lstat.isSymbolicLink()) {
        if (!symLinks[lstat.dev]) {
          symLinks[lstat.dev] = {};
        }
        // Ignore if we've seen it before
        if (symLinks[lstat.dev][lstat.ino]) {
          return;
        }
        symLinks[lstat.dev][lstat.ino] = true;
      }
      const fstat = fs.statSync(fpath);
      if (fstat.isDirectory()) {
        const child = tree[file] = {}
        rdSync(fpath, child)
      } else {
        tree[file] = null
      }
    } catch (e) {
      // Ignore and move on.
    }
  });
  return tree
}

const fsListing = JSON.stringify(rdSync(process.cwd(), {}));
if (process.argv.length === 3) {
  const fname = process.argv[2];
  let parent = path.dirname(fname);
  while (!fs.existsSync(parent)) {
    fs.mkdirSync(parent);
    parent = path.dirname(parent);
  }
  fs.writeFileSync(fname, fsListing, { encoding: 'utf8' });
} else {
  console.log(fsListing);
}
