import { splitQueryFromPath } from './query-path';

it('can convert a query from the path', () => {
  const path = './App.vue?vue&template=test';

  expect(splitQueryFromPath(path)).toEqual({
    modulePath: './App.vue',
    queryPath: '?vue&template=test',
  });
});
