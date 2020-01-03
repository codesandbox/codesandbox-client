import * as path from './path';

describe('path', () => {
  describe('join', () => {
    it('can join paths', () => {
      expect(path.join('dir1', 'dir2')).toEqual('dir1/dir2');
    });

    it('can join absolute paths', () => {
      expect(path.join('/dir1', 'dir2')).toEqual('/dir1/dir2');
    });

    it('can join top paths', () => {
      expect(path.join('/dir1', '../dir2')).toEqual('/dir2');
    });

    it('can join top paths', () => {
      expect(path.join('/dir1', '../../dir2')).toEqual('/dir2');
    });

    it('can join top paths', () => {
      expect(path.join('/dir1/dir2/dir3', '../dir4')).toEqual(
        '/dir1/dir2/dir4'
      );
    });
  });

  describe('dirname', () => {
    it('can find the dirname', () => {
      expect(path.dirname('test1/test2/file.js')).toEqual('test1/test2');
    });
  });
});
