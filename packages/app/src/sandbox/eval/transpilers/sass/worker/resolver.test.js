import * as Sass from 'sass';
import { getPossibleSassPaths, getPathVariations } from './resolver';

describe('sass resolver', () => {
  it('Generates a list of all possible sass import locations', () => {
    const paths = ['/fragments', '/mixins'];
    expect(getPossibleSassPaths(paths, 'test', Sass)).toStrictEqual([
      '/fragments/test',
      '/mixins/test',
      '/node_modules/test',
    ]);
  });

  it('Should handle node_module imports using `~`', () => {
    const paths = ['/src'];
    expect(getPossibleSassPaths(paths, 'something.scss', Sass)).toStrictEqual([
      '/src/something.scss',
      '/node_modules/something.scss',
    ]);
  });

  it('Should handle node_module imports using `~`', () => {
    expect(getPathVariations('test')).toStrictEqual([
      'test.scss',
      '_test.scss',
      'test.sass',
      '_test.sass',
      'test.css',
      '_test.css',
      'test/index.scss',
      'test/_index.scss',
      'test/index.sass',
      'test/_index.sass',
      'test/index.css',
      'test/_index.css',
    ]);
  });

  it('Should handle node_module imports using `~`', () => {
    expect(getPathVariations('something.scss')).toStrictEqual([
      'something.scss',
      '_something.scss',
    ]);
  });
});
