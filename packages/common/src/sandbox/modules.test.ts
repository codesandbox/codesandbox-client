import { resolveModule, getModulesInDirectory } from './modules';

describe.skip('root', () => {
  test('it resolves root path', () => {
    const path = './Test';
    const modules = [
      {
        id: '123123',
        title: 'Test',
        directoryShortid: null,
      },
    ];

    const directories = [];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it resolves index files', () => {
    const path = './';
    const modules = [
      {
        id: '123123',
        title: 'index',
        directoryShortid: null,
      },
    ];

    const directories = [];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it resolves entry files', () => {
    const path = 'src/index.js';
    const directories = [
      {
        id: '123124',
        title: 'src',
        shortid: '123124',
        directoryShortid: null,
      },
      {
        id: '123125',
        title: 'test',
        shortid: '123125',
        directoryShortid: null,
      },
    ];
    const modules = [
      {
        id: '123123',
        title: 'index.js',
        directoryShortid: null,
      },
      {
        id: '123126',
        title: 'index.js',
        directoryShortid: '123124',
      },
      {
        id: '123127',
        title: 'sum.js',
        directoryShortid: '123124',
      },
    ];

    expect(resolveModule(path, modules, directories)).toBe(modules[1]);
  });
});

describe('one directory deep', () => {
  test('it resolves path', () => {
    const path = './Directory/Test';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
    ];

    const modules = [
      {
        id: '123123',
        title: 'Test',
        directoryShortid: directories[0].shortid,
      },
    ];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it resolves index', () => {
    const path = './Directory/';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
    ];

    const modules = [
      {
        id: '123123',
        title: 'index',
        directoryShortid: directories[0].shortid,
      },
    ];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });
});

describe('two directories deep', () => {
  test('it resolves path', () => {
    const path = './Directory/Directory2/Test';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
      {
        id: '1312',
        shortid: '1312423432',
        title: 'Directory2',
        directoryShortid: '123123123',
      },
    ];

    const modules = [
      {
        id: '123123',
        title: 'Test',
        directoryShortid: '1312423432',
      },
    ];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it resolves index', () => {
    const path = './Directory/Directory2/index';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
      {
        id: '1312',
        shortid: '1312423432',
        title: 'Directory2',
        directoryShortid: '123123123',
      },
    ];

    const modules = [
      {
        id: '123123',
        title: 'index',
        directoryShortid: '1312423432',
      },
    ];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });
});

describe.skip('relative', () => {
  test('it finds something relative from directory', () => {
    const path = './Directory2';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
      {
        id: '1312',
        shortid: '1312423432',
        title: 'Directory2',
        directoryShortid: '123123123',
      },
    ];

    const modules = [
      {
        id: '123123',
        title: 'index',
        directoryShortid: '1312423432',
      },
    ];
    expect(resolveModule(path, modules, directories, '123123123')).toBe(
      modules[0]
    );
  });

  test('it finds current index', () => {
    const path = './';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
      {
        id: '1312',
        shortid: '1312423432',
        title: 'Directory2',
        directoryShortid: '123123123',
      },
    ];

    const modules = [
      {
        id: '123123',
        title: 'index',
        directoryShortid: '1312423432',
      },
    ];
    expect(resolveModule(path, modules, directories, '1312423432')).toBe(
      modules[0]
    );
  });

  test('it finds a parent', () => {
    const path = '../Test';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
      {
        id: '1312',
        shortid: '1312423432',
        title: 'Directory2',
        directoryShortid: '123123123',
      },
    ];

    const modules = [
      {
        id: '12666',
        title: 'Test',
        directoryShortid: null,
      },
      {
        id: '123123',
        title: 'index',
        directoryShortid: '1312423432',
      },
    ];
    expect(resolveModule(path, modules, directories, '123123123')).toBe(
      modules[0]
    );
  });

  test('it finds a of a parent parent', () => {
    const path = '../../Test';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
      {
        id: '1312',
        shortid: '1312423432',
        title: 'Directory2',
        directoryShortid: '123123123',
      },
    ];

    const modules = [
      {
        id: '12666',
        title: 'Test',
        directoryShortid: null,
      },
      {
        id: '123123',
        title: 'index',
        directoryShortid: '1312423432',
      },
    ];
    expect(resolveModule(path, modules, directories, '1312423432')).toBe(
      modules[0]
    );
  });

  test("it doesn't find itself if nothing is found", () => {
    const path = './Tes';
    const directories = [
      {
        id: '12312',
        shortid: '123123123',
        title: 'Test',
        directoryShortid: null,
      },
    ];

    const modules = [
      {
        id: '12666',
        title: 'index',
        directoryShortid: '123123123',
      },
      {
        id: '123123',
        title: 'index',
        directoryShortid: null,
      },
    ];

    expect(() => resolveModule(path, modules, directories, null)).toThrow();
  });
});

describe.skip('preference', () => {
  test('it prefers files over folders', () => {
    const path = './Test';
    const directories = [
      {
        id: '113',
        shortid: '123123123',
        title: 'Directory',
        directoryShortid: null,
      },
      {
        id: '1312423432',
        shortid: '1312423432',
        title: 'Test',
        directoryShortid: '123123123',
      },
    ];

    const modules = [
      {
        id: '12666',
        title: 'Test',
        directoryShortid: null,
      },
      {
        id: '123123',
        title: 'index',
        directoryShortid: '123123123',
      },
    ];
    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it prefers files over generic index', () => {
    const path = './Test';
    const directories = [];

    const modules = [
      {
        id: '123123',
        title: 'index',
        directoryShortid: null,
      },
      {
        id: '12666',
        title: 'Test',
        directoryShortid: null,
      },
    ];
    expect(resolveModule(path, modules, directories)).toBe(modules[1]);
  });

  describe('getModulesInDirectory', () => {
    it('lists all files in directory', () => {
      const path = './';
      const directories = [];

      const modules = [
        {
          id: '123123',
          title: 'index',
          directoryShortid: null,
        },
        {
          id: '12666',
          title: 'Test',
          directoryShortid: null,
        },
      ];
      expect(getModulesInDirectory(path, modules, directories).modules).toEqual(
        modules
      );
    });

    it('lists all files in subdirectory', () => {
      const path = './test/';
      const directories = [
        {
          id: '113',
          shortid: '123123123',
          title: 'test',
          directoryShortid: null,
        },
      ];

      const modules = [
        {
          id: '123123',
          title: 'index',
          directoryShortid: '123123123',
        },
        {
          id: '12666',
          title: 'Test',
          directoryShortid: '123123123',
        },
      ];
      expect(getModulesInDirectory(path, modules, directories).modules).toEqual(
        modules
      );
    });
  });
});
