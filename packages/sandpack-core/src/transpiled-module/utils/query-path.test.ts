import { splitQueryFromPath } from './query-path';

describe('Split query from path', () => {
  it('Can extract regular query parameters', () => {
    expect(splitQueryFromPath('./App.vue?vue&template=test')).toEqual({
      modulePath: './App.vue',
      queryPath: '?vue&template=test',
    });
  });

  it('Can extract special `!` params', () => {
    expect(splitQueryFromPath('url-loader!test!./test.js')).toEqual({
      modulePath: './test.js',
      queryPath: 'url-loader!test',
    });
  });

  it('Should not extract `!` is it is part of a url or filepath', () => {
    expect(splitQueryFromPath('./test.js!cjs')).toEqual({
      modulePath: './test.js!cjs',
      queryPath: '',
    });

    expect(splitQueryFromPath('/npm:shopify-buy@2.11.0!cjs')).toEqual({
      modulePath: '/npm:shopify-buy@2.11.0!cjs',
      queryPath: '',
    });
  });
});
