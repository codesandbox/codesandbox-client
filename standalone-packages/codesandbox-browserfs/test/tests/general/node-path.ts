import assert from '../../harness/wrapped-assert';
import * as path from 'path';

export default function() {
  var isWindows = process.platform === 'win32';
  var failures: string[] = [];

  // BFS: Make explicit for the browser.
  var f = '/Users/jvilk/Code/BrowserFS/test/node/test-path.js';

  assert.equal(path.basename(f), 'test-path.js');
  assert.equal(path.basename(f, '.js'), 'test-path');
  assert.equal(path.basename(''), '');
  assert.equal(path.basename('/dir/basename.ext'), 'basename.ext');
  assert.equal(path.basename('/basename.ext'), 'basename.ext');
  assert.equal(path.basename('basename.ext'), 'basename.ext');
  assert.equal(path.basename('basename.ext/'), 'basename.ext');
  assert.equal(path.basename('basename.ext//'), 'basename.ext');
  assert.equal(path.basename('aaa/bbb', '/bbb'), 'bbb');
  assert.equal(path.basename('aaa/bbb', 'a/bbb'), 'bbb');
  //assert.equal(path.basename('aaa/bbb', 'bbb'), 'bbb');
  assert.equal(path.basename('aaa/bbb//', 'bbb'), 'bbb');
  assert.equal(path.basename('aaa/bbb', 'bb'), 'b');
  assert.equal(path.basename('aaa/bbb', 'b'), 'bb');
  assert.equal(path.basename('/aaa/bbb', '/bbb'), 'bbb');
  assert.equal(path.basename('/aaa/bbb', 'a/bbb'), 'bbb');
  //assert.equal(path.basename('/aaa/bbb', 'bbb'), 'bbb');
  assert.equal(path.basename('/aaa/bbb//', 'bbb'), 'bbb');
  assert.equal(path.basename('/aaa/bbb', 'bb'), 'b');
  assert.equal(path.basename('/aaa/bbb', 'b'), 'bb');
  assert.equal(path.basename('/aaa/bbb'), 'bbb');
  assert.equal(path.basename('/aaa/'), 'aaa');
  assert.equal(path.basename('/aaa/b'), 'b');
  assert.equal(path.basename('/a/b'), 'b');
  assert.equal(path.basename('//a'), 'a');

  // On unix a backslash is just treated as any other character.
  assert.equal(path.basename('\\dir\\basename.ext'), '\\dir\\basename.ext');
  assert.equal(path.basename('\\basename.ext'), '\\basename.ext');
  assert.equal(path.basename('basename.ext'), 'basename.ext');
  assert.equal(path.basename('basename.ext\\'), 'basename.ext\\');
  assert.equal(path.basename('basename.ext\\\\'), 'basename.ext\\\\');
  assert.equal(path.posix.basename('foo'), 'foo');

  // POSIX filenames may include control characters
  // c.f. http://www.dwheeler.com/essays/fixing-unix-linux-filenames.html
  if (!isWindows) {
    var controlCharFilename = 'Icon' + String.fromCharCode(13);
    assert.equal(path.basename('/a/b/' + controlCharFilename),
                 controlCharFilename);
  }

  assert.equal(path.extname(f), '.js');

  // BFS: Our path is different from node's.
  assert.equal(path.dirname(f).substr(-9), 'test/node');
  assert.equal(path.dirname('/a/b/'), '/a');
  assert.equal(path.dirname('/a/b'), '/a');
  assert.equal(path.dirname('/a'), '/');
  assert.equal(path.dirname(''), '.');
  assert.equal(path.dirname('/'), '/');
  assert.equal(path.dirname('////'), '/');
  // https://github.com/jvilk/BrowserFS/issues/96
  assert.equal(path.dirname('a/b'), 'a');

  // path.extname tests
  [
    [f, '.js'],
    ['', ''],
    ['/path/to/file', ''],
    ['/path/to/file.ext', '.ext'],
    ['/path.to/file.ext', '.ext'],
    ['/path.to/file', ''],
    ['/path.to/.file', ''],
    ['/path.to/.file.ext', '.ext'],
    ['/path/to/f.ext', '.ext'],
    ['/path/to/..ext', '.ext'],
    ['/path/to/..', ''],
    ['file', ''],
    ['file.ext', '.ext'],
    ['.file', ''],
    ['.file.ext', '.ext'],
    ['/file', ''],
    ['/file.ext', '.ext'],
    ['/.file', ''],
    ['/.file.ext', '.ext'],
    ['.path/file.ext', '.ext'],
    ['file.ext.ext', '.ext'],
    ['file.', '.'],
    ['.', ''],
    ['./', ''],
    ['.file.ext', '.ext'],
    ['.file', ''],
    ['.file.', '.'],
    ['.file..', '.'],
    ['..', ''],
    ['../', ''],
    ['..file.ext', '.ext'],
    ['..file', '.file'],
    ['..file.', '.'],
    ['..file..', '.'],
    ['...', '.'],
    ['...ext', '.ext'],
    ['....', '.'],
    ['file.ext/', '.ext'],
    ['file.ext//', '.ext'],
    ['file/', ''],
    ['file//', ''],
    ['file./', '.'],
    ['file.//', '.'],
  ].forEach(function(test) {
    [path.posix.extname, path.win32.extname].forEach(function(extname) {
      var input = test[0];
      var os = 'posix';
      var actual = extname(input);
      var expected = test[1];
      var fn = "path" + os + ".extname(";
      var message = fn + JSON.stringify(input) + ')' +
                      '\n  expect=' + JSON.stringify(expected) +
                      '\n  actual=' + JSON.stringify(actual);
      if (actual !== expected)
        failures.push('\n' + message);
    });
  });
  assert.equal(failures.length, 0, failures.join(''));

  assert.equal(path.extname(''), '');
  assert.equal(path.extname('/path/to/file'), '');
  assert.equal(path.extname('/path/to/file.ext'), '.ext');
  assert.equal(path.extname('/path.to/file.ext'), '.ext');
  assert.equal(path.extname('/path.to/file'), '');
  assert.equal(path.extname('/path.to/.file'), '');
  assert.equal(path.extname('/path.to/.file.ext'), '.ext');
  assert.equal(path.extname('/path/to/f.ext'), '.ext');
  assert.equal(path.extname('/path/to/..ext'), '.ext');
  assert.equal(path.extname('file'), '');
  assert.equal(path.extname('file.ext'), '.ext');
  assert.equal(path.extname('.file'), '');
  assert.equal(path.extname('.file.ext'), '.ext');
  assert.equal(path.extname('/file'), '');
  assert.equal(path.extname('/file.ext'), '.ext');
  assert.equal(path.extname('/.file'), '');
  assert.equal(path.extname('/.file.ext'), '.ext');
  assert.equal(path.extname('.path/file.ext'), '.ext');
  assert.equal(path.extname('file.ext.ext'), '.ext');
  assert.equal(path.extname('file.'), '.');
  assert.equal(path.extname('.'), '');
  assert.equal(path.extname('./'), '');
  assert.equal(path.extname('.file.ext'), '.ext');
  assert.equal(path.extname('.file'), '');
  assert.equal(path.extname('.file.'), '.');
  assert.equal(path.extname('.file..'), '.');
  assert.equal(path.extname('..'), '');
  assert.equal(path.extname('../'), '');
  assert.equal(path.extname('..file.ext'), '.ext');
  assert.equal(path.extname('..file'), '.file');
  assert.equal(path.extname('..file.'), '.');
  assert.equal(path.extname('..file..'), '.');
  assert.equal(path.extname('...'), '.');
  assert.equal(path.extname('...ext'), '.ext');
  assert.equal(path.extname('....'), '.');
  assert.equal(path.extname('file.ext/'), '.ext');
  assert.equal(path.extname('file.ext//'), '.ext');
  assert.equal(path.extname('file/'), '');
  assert.equal(path.extname('file//'), '');
  assert.equal(path.extname('file./'), '.');
  assert.equal(path.extname('file.//'), '.');

  // On unix, backspace is a valid name component like any other character.
  assert.equal(path.extname('.\\'), '');
  assert.equal(path.extname('..\\'), '.\\');
  assert.equal(path.extname('file.ext\\'), '.ext\\');
  assert.equal(path.extname('file.ext\\\\'), '.ext\\\\');
  assert.equal(path.extname('file\\'), '');
  assert.equal(path.extname('file\\\\'), '');
  assert.equal(path.extname('file.\\'), '.\\');
  assert.equal(path.extname('file.\\\\'), '.\\\\');

  // path.join tests
  var joinTests: [string[], string][] =
      // arguments                     result
      [[['.', 'x/b', '..', '/b/c.js'], 'x/b/c.js'],
       [['/.', 'x/b', '..', '/b/c.js'], '/x/b/c.js'],
       [['/foo', '../../../bar'], '/bar'],
       [['foo', '../../../bar'], '../../bar'],
       [['foo/', '../../../bar'], '../../bar'],
       [['foo/x', '../../../bar'], '../bar'],
       [['foo/x', './bar'], 'foo/x/bar'],
       [['foo/x/', './bar'], 'foo/x/bar'],
       [['foo/x/', '.', 'bar'], 'foo/x/bar'],
       [['./'], './'],
       [['.', './'], './'],
       [['.', '.', '.'], '.'],
       [['.', './', '.'], '.'],
       [['.', '/./', '.'], '.'],
       [['.', '/////./', '.'], '.'],
       [['.'], '.'],
       [['', '.'], '.'],
       [['', 'foo'], 'foo'],
       [['foo', '/bar'], 'foo/bar'],
       [['', '/foo'], '/foo'],
       [['', '', '/foo'], '/foo'],
       [['', '', 'foo'], 'foo'],
       [['foo', ''], 'foo'],
       [['foo/', ''], 'foo/'],
       [['foo', '', '/bar'], 'foo/bar'],
       [['./', '..', '/foo'], '../foo'],
       [['./', '..', '..', '/foo'], '../../foo'],
       [['.', '..', '..', '/foo'], '../../foo'],
       [['', '..', '..', '/foo'], '../../foo'],
       [['/'], '/'],
       [['/', '.'], '/'],
       [['/', '..'], '/'],
       [['/', '..', '..'], '/'],
       [[''], '.'],
       [['', ''], '.'],
       [[' /foo'], ' /foo'],
       [[' ', 'foo'], ' /foo'],
       [[' ', '.'], ' '],
       [[' ', '/'], ' /'],
       [[' ', ''], ' '],
       [['/', 'foo'], '/foo'],
       [['/', '/foo'], '/foo'],
       [['/', '//foo'], '/foo'],
       [['/', '', '/foo'], '/foo'],
       [['', '/', 'foo'], '/foo'],
       [['', '/', '/foo'], '/foo']
      ];

  // Run the join tests.
  joinTests.forEach(function(test) {
    var actual = path.join.apply(path, test[0]);
    var expected = isWindows ? test[1].replace(/\//g, '\\') : test[1];
    var message = 'path.join(' + test[0].map(<any> JSON.stringify).join(',') + ')' +
                  '\n  expect=' + JSON.stringify(expected) +
                  '\n  actual=' + JSON.stringify(actual);
    if (actual !== expected) failures.push('\n' + message);
    // assert.equal(actual, expected, message);
  });
  assert.equal(failures.length, 0, failures.join(''));
  var joinThrowTests: any[] = [true, false, 7, null, {}, undefined, [], NaN];
  joinThrowTests.forEach(function(test: any) {
    assert.throws(function() {
      path.join(test);
    }, TypeError);
    assert.throws(function() {
      path.resolve(test);
    }, TypeError);
  });


  // path normalize tests
  assert.equal(path.normalize('./fixtures///b/../b/c.js'),
               'fixtures/b/c.js');
  assert.equal(path.normalize('/foo/../../../bar'), '/bar');
  assert.equal(path.normalize('a//b//../b'), 'a/b');
  assert.equal(path.normalize('a//b//./c'), 'a/b/c');
  assert.equal(path.normalize('a//b//.'), 'a/b');
  assert.equal(path.posix.normalize('/a/b/c/../../../x/y/z'), '/x/y/z');
  assert.equal(path.posix.normalize('///..//./foo/.//bar'), '/foo/bar');

  // path.resolve tests
  // Posix
  var resolveTests: [string[], string][] =
      // arguments                                    result
      [[['/var/lib', '../', 'file/'], '/var/file'],
       [['/var/lib', '/../', 'file/'], '/file'],
       [['a/b/c/', '../../..'], process.cwd()],
       [['.'], process.cwd()],
       [['/some/dir', '.', '/absolute/'], '/absolute'],
       [['/foo/tmp.3/', '../tmp.3/cycles/root.js'], '/foo/tmp.3/cycles/root.js']];

  failures = [];
  resolveTests.forEach(function(test) {
    var actual = path.resolve.apply(path, test[0]);
    var expected = test[1];
    var message = 'path.resolve(' + test[0].map(<any> JSON.stringify).join(',') + ')' +
                  '\n  expect=' + JSON.stringify(expected) +
                  '\n  actual=' + JSON.stringify(actual);
    if (actual !== expected) failures.push('\n' + message);
    // assert.equal(actual, expected, message);
  });
  assert.equal(failures.length, 0, failures.join(''));

  // path.isAbsolute tests
  assert.equal(path.isAbsolute('/home/foo'), true);
  assert.equal(path.isAbsolute('/home/foo/..'), true);
  assert.equal(path.isAbsolute('bar/'), false);
  assert.equal(path.isAbsolute('./baz'), false);

  // path.relative tests
  // posix
  var relativeTests =
      // arguments                    result
      [['/var/lib', '/var', '..'],
       ['/var/lib', '/bin', '../../bin'],
       ['/var/lib', '/var/lib', ''],
       ['/var/lib', '/var/apache', '../apache'],
       ['/var/', '/var/lib', 'lib'],
       ['/', '/var/lib', 'var/lib'],
       ['/foo/test', '/foo/test/bar/package.json', 'bar/package.json'],
       ['/Users/a/web/b/test/mails', '/Users/a/web/b', '../..'],
       ['/foo/bar/baz-quux', '/foo/bar/baz', '../baz'],
       ['/foo/bar/baz', '/foo/bar/baz-quux', '../baz-quux'],
       ['/baz-quux', '/baz', '../baz'],
       ['/baz', '/baz-quux', '../baz-quux']
     ];
  failures = [];
  relativeTests.forEach(function(test) {
    var actual = path.relative(test[0], test[1]);
    var expected = test[2];
    var message = 'path.relative(' +
                  test.slice(0, 2).map(<any> JSON.stringify).join(',') +
                  ')' +
                  '\n  expect=' + JSON.stringify(expected) +
                  '\n  actual=' + JSON.stringify(actual);
    if (actual !== expected) failures.push('\n' + message);
  });
  assert.equal(failures.length, 0, failures.join(''));

  // path.sep tests
  // posix
  assert.equal(path.sep, '/');
  // posix
  assert.equal(path.posix.sep, '/');

  // path.delimiter tests
  // posix
  assert.equal(path.delimiter, ':');
  // posix
  assert.equal(path.posix.delimiter, ':');

  // path._makeLong tests
  var emptyObj = {};
  assert.equal((<any> path.posix)._makeLong('/foo/bar'), '/foo/bar');
  assert.equal((<any> path.posix)._makeLong('foo/bar'), 'foo/bar');
  assert.equal((<any> path.posix)._makeLong(null), null);
  assert.equal((<any> path.posix)._makeLong(true), true);
  assert.equal((<any> path.posix)._makeLong(1), 1);
  assert.equal((<any> path.posix)._makeLong(), undefined);
  assert.equal((<any> path.posix)._makeLong(emptyObj), emptyObj);
};
