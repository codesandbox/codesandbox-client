import { getParentDirectories } from './fs';

describe('get parent directories', () => {
  it('Should return a list of all parent directories', () => {
    const directories = getParentDirectories('/src/index');
    expect(directories).toEqual(['/src/index', '/src', '/']);
  });

  it('Should return a list of all parent directories above the rootDir', () => {
    const directories = getParentDirectories('/src/index', '/src');
    expect(directories).toEqual(['/src/index', '/src']);
  });
});
