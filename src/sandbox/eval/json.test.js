import json from './json';

test('json parses code', () => {
  expect(json({ code: `{"test": "test"}` })).toEqual({ test: 'test' });
});
