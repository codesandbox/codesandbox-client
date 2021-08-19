import fs from 'fs';
import path from 'path';
import gensync from 'gensync';

import { resolveSync } from './resolver';

const FIXTURE_PATH = path.join(__dirname, 'fixture');

const readFiles = (
  dir: string,
  rootPath: string,
  files: Map<string, string>
) => {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const filepath = path.join(dir, entry);
    const entryStats = fs.statSync(filepath);
    if (entryStats.isDirectory()) {
      readFiles(filepath, rootPath, files);
    } else if (entryStats.isFile()) {
      files.set(
        filepath.replace(rootPath, ''),
        fs.readFileSync(filepath, 'utf8')
      );
    }
  }
  return files;
};

describe('resolver', () => {
  const files: Map<string, string> = readFiles(
    FIXTURE_PATH,
    FIXTURE_PATH,
    new Map()
  );
  const isFile = gensync({
    sync: (p: string) => files.has(p),
  });
  const readFile = gensync({
    sync: (p: string) => {
      if (!files.has(p)) {
        throw new Error('File not found');
      }
      return files.get(p);
    },
  });

  describe('file paths', () => {
    it('should resolve relative file with an extension', () => {
      const resolved = resolveSync('../source/dist.js', {
        filename: '/packages/source-alias/other.js',
        extensions: ['.js'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/packages/source/dist.js');
    });

    it('should resolve relative file without an extension', () => {
      const resolved = resolveSync('./bar', {
        filename: '/foo.js',
        extensions: ['.js'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/bar.js');
    });

    it('should resolve an absolute path with extension', () => {
      const resolved = resolveSync('/bar.js', {
        filename: '/foo.js',
        extensions: ['.js'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/bar.js');
    });

    it('should resolve an absolute path without extension', () => {
      const resolved = resolveSync('/nested/test', {
        filename: '/nested/index.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/nested/test.js');
    });

    it('should fallback to index if file does not exist', () => {
      const resolved = resolveSync('/nested', {
        filename: '/nested/test.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/nested/index.js');
    });
  });

  describe('node modules', () => {
    it('should be able to resolve a node_modules index.js', () => {
      const resolved = resolveSync('foo', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/foo/index.js');
    });

    it('should resolve a node_modules package.main', () => {
      const resolved = resolveSync('package-main', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-main/main.js');
    });

    it('should resolve a node_modules package.module', () => {
      const resolved = resolveSync('package-module', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-module/module.js');
    });

    it('should resolve a node_modules package.browser main field', () => {
      const resolved = resolveSync('package-browser', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-browser/browser.js');
    });

    it('should fall back to index.js when it cannot find package.main', () => {
      const resolved = resolveSync('package-fallback', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-fallback/index.js');
    });

    it('should resolve a node_module package.main pointing to a directory', () => {
      const resolved = resolveSync('package-main-directory', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe(
        '/node_modules/package-main-directory/nested/index.js'
      );
    });

    it('should resolve a file inside a node_modules folder', () => {
      const resolved = resolveSync('foo/nested/baz', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/foo/nested/baz.js');
    });

    it('should resolve a scoped module', () => {
      const resolved = resolveSync('@scope/pkg', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/@scope/pkg/index.js');
    });

    it('should resolve a file inside a scoped module', () => {
      const resolved = resolveSync('@scope/pkg/foo/bar', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/@scope/pkg/foo/bar.js');
    });
  });

  describe('aliases', () => {
    it('should alias the main file using the package.browser field', () => {
      const resolved = resolveSync('package-browser-alias', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-browser-alias/browser.js');
    });

    it('should alias a sub-file using the package.browser field', () => {
      const resolved = resolveSync('package-browser-alias/foo', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-browser-alias/bar.js');
    });

    it('should alias a relative file using the package.browser field', () => {
      const resolved = resolveSync('./foo', {
        filename: '/node_modules/package-browser-alias/browser.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-browser-alias/bar.js');
    });

    it('should alias a deep nested relative file using the package.browser field', () => {
      const resolved = resolveSync('./nested', {
        filename: '/node_modules/package-browser-alias/browser.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe(
        '/node_modules/package-browser-alias/subfolder1/subfolder2/subfile.js'
      );
    });

    it('should alias a sub-file using the package.alias field', () => {
      const resolved = resolveSync('package-alias/foo', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-alias/bar.js');
    });

    it('should alias a relative file using the package.alias field', () => {
      const resolved = resolveSync('./foo', {
        filename: '/node_modules/package-alias/browser.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-alias/bar.js');
    });

    it('should alias a glob using the package.alias field', () => {
      const resolved = resolveSync('./lib/test', {
        filename: '/node_modules/package-alias-glob/index.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/package-alias-glob/src/test.js');
    });

    it('should apply a module alias using the package.alias field in the root package', () => {
      const resolved = resolveSync('aliased', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/node_modules/foo/index.js');
    });

    it('should apply a module alias pointing to a file using the package.alias field', () => {
      const resolved = resolveSync('aliased-file', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('/bar.js');
    });

    it('should resolve to an empty file when package.browser resolves to false', () => {
      const resolved = resolveSync('package-browser-exclude', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('//empty.js');
    });

    it('should resolve to an empty file when package.alias resolves to false', () => {
      const resolved = resolveSync('package-alias-exclude', {
        filename: '/foo.js',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        isFile,
        readFile,
      });
      expect(resolved).toBe('//empty.js');
    });
  });
});
