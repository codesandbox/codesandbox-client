import resolveModule from './resolve-module';


describe('root', () => {
  test('it resolves root path', () => {
    const path = './Test';
    const modules = [{
      id: '123123',
      title: 'Test',
      directoryId: null,
    }];

    const directories = [];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it resolves index files', () => {
    const path = './';
    const modules = [{
      id: '123123',
      title: 'index',
      directoryId: null,
    }];

    const directories = [];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });
});

describe('one directory deep', () => {
  test('it resolves path', () => {
    const path = './Directory/Test';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }];

    const modules = [{
      id: '123123',
      title: 'Test',
      directoryId: directories[0].id,
    }];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it resolves index', () => {
    const path = './Directory/';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }];

    const modules = [{
      id: '123123',
      title: 'index',
      directoryId: directories[0].id,
    }];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });
});

describe('two directories deep', () => {
  test('it resolves path', () => {
    const path = './Directory/Directory2/Test';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }, {
      id: '1312423432',
      title: 'Directory2',
      directoryId: '123123123',
    }];

    const modules = [{
      id: '123123',
      title: 'Test',
      directoryId: '1312423432',
    }];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it resolves index', () => {
    const path = './Directory/Directory2/index';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }, {
      id: '1312423432',
      title: 'Directory2',
      directoryId: '123123123',
    }];

    const modules = [{
      id: '123123',
      title: 'index',
      directoryId: '1312423432',
    }];

    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });
});

describe('relative', () => {
  test('it finds something relative from directory', () => {
    const path = './Directory2';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }, {
      id: '1312423432',
      title: 'Directory2',
      directoryId: '123123123',
    }];

    const modules = [{
      id: '123123',
      title: 'index',
      directoryId: '1312423432',
    }];
    expect(resolveModule(path, modules, directories, '123123123')).toBe(modules[0]);
  });

  test('it finds current index', () => {
    const path = './';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }, {
      id: '1312423432',
      title: 'Directory2',
      directoryId: '123123123',
    }];

    const modules = [{
      id: '123123',
      title: 'index',
      directoryId: '1312423432',
    }];
    expect(resolveModule(path, modules, directories, '1312423432')).toBe(modules[0]);
  });

  test('it finds a parent', () => {
    const path = '../Test';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }, {
      id: '1312423432',
      title: 'Directory2',
      directoryId: '123123123',
    }];

    const modules = [{
      id: '12666',
      title: 'Test',
      directoryId: null,
    }, {
      id: '123123',
      title: 'index',
      directoryId: '1312423432',
    }];
    expect(resolveModule(path, modules, directories, '123123123')).toBe(modules[0]);
  });

  test('it finds a of a parent parent', () => {
    const path = '../../Test';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }, {
      id: '1312423432',
      title: 'Directory2',
      directoryId: '123123123',
    }];

    const modules = [{
      id: '12666',
      title: 'Test',
      directoryId: null,
    }, {
      id: '123123',
      title: 'index',
      directoryId: '1312423432',
    }];
    expect(resolveModule(path, modules, directories, '1312423432')).toBe(modules[0]);
  });
});

describe('preference', () => {
  test('it prefers files over folders', () => {
    const path = './Test';
    const directories = [{
      id: '123123123',
      title: 'Directory',
      directoryId: null,
    }, {
      id: '1312423432',
      title: 'Test',
      directoryId: '123123123',
    }];

    const modules = [{
      id: '12666',
      title: 'Test',
      directoryId: null,
    }, {
      id: '123123',
      title: 'index',
      directoryId: '123123123',
    }];
    expect(resolveModule(path, modules, directories)).toBe(modules[0]);
  });

  test('it prefers files over generic index', () => {
    const path = './Test';
    const directories = [];

    const modules = [{
      id: '123123',
      title: 'index',
      directoryId: null,
    }, {
      id: '12666',
      title: 'Test',
      directoryId: null,
    }];
    expect(resolveModule(path, modules, directories)).toBe(modules[1]);
  });
});

