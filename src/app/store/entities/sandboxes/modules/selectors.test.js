import { getModuleParents } from './selectors';

describe('entities', () => {
  describe('modules', () => {
    describe('selectors', () => {
      it('can find the correct parent directories of a module', () => {
        const directories = [
          {
            id: 'i1',
            shortid: '1',
            directoryShortid: null,
          },
          {
            id: 'i2',
            shortid: '2',
            directoryShortid: '1',
          },
        ];

        const modules = [
          {
            id: 'm3',
            shortid: '3',
            directoryShortid: '2',
          },
        ];

        expect(getModuleParents(modules, directories, 'm3')).toEqual([
          'i2',
          'i1',
        ]);
      });

      it('can find no parent directories of a module', () => {
        const directories = [
          {
            id: 'i1',
            shortid: '1',
            directoryShortid: null,
          },
          {
            id: 'i2',
            shortid: '2',
            directoryShortid: '1',
          },
        ];

        const modules = [
          {
            id: 'm3',
            shortid: '3',
            directoryShortid: null,
          },
        ];

        expect(getModuleParents(modules, directories, 'm3')).toEqual([]);
      });
    });
  });
});
