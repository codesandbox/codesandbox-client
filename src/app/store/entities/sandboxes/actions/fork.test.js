import { createModule, createDirectory } from 'common/test/mocks';
import { getEquivalentModule, getEquivalentDirectory } from './fork';

describe('equivalent', () => {
  it('finds the equivalent module', () => {
    const module = createModule();
    const eqModule = createModule(0, { ...module, id: 'newid' });
    const modules = [module, eqModule];

    expect(getEquivalentModule(module, modules)).toEqual(eqModule);
  });

  it('finds the equivalent module if order is the other way around', () => {
    const module = createModule();
    const eqModule = createModule(0, { ...module, id: 'newid' });
    const modules = [eqModule, eqModule];

    expect(getEquivalentModule(module, modules)).toEqual(eqModule);
  });

  it('returns undefined when equivalent module not found', () => {
    const module = createModule();

    const modules = [module];
    expect(getEquivalentModule(module, modules)).toBeUndefined();
  });

  it('finds the equivalent directory', () => {
    const directory = createDirectory();
    const eqDirectory = createDirectory(0, { ...directory, id: 'newid' });
    const directories = [directory, eqDirectory];

    expect(getEquivalentDirectory(directory, directories)).toEqual(eqDirectory);
  });

  it('returns undefined when equivalent directory not found', () => {
    const directory = createDirectory();

    const directories = [directory];
    expect(getEquivalentDirectory(directory, directories)).toBeUndefined();
  });
});
