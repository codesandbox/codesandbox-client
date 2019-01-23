import {default as FS, FSModule} from './FS';

// Manually export the individual public functions of fs.
// Required because some code will invoke functions off of the module.
// e.g.:
// let writeFile = fs.writeFile;
// writeFile(...)

/**
 * @hidden
 */
let fs: any = new FS();
/**
 * @hidden
 */
const _fsMock: FSModule = <any> {};
/**
 * @hidden
 */
const fsProto = FS.prototype;
Object.keys(fsProto).forEach((key) => {
  if (typeof fs[key] === 'function') {
    (<any> _fsMock)[key] = function() {
      return (<Function> fs[key]).apply(fs, arguments);
    };
  } else {
    (<any> _fsMock)[key] = fs[key];
  }
});

_fsMock['changeFSModule'] = function(newFs: FS): void {
  fs = newFs;
};
_fsMock['getFSModule'] = function(): FS {
  return fs;
};
_fsMock['FS'] = FS;

export default _fsMock;
