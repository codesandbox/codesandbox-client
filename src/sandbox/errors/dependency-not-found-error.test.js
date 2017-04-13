import DependencyError from './dependency-not-found-error';

test('it handles normal deps correctly', () => {
  const error = new DependencyError('redux-form');

  expect(error.payload).toEqual({ dependency: 'redux-form' });
});

test('it parses dependency names with slashes correctly', () => {
  const error = new DependencyError('redux-form/immutable');

  expect(error.payload).toEqual({ dependency: 'redux-form' });
});

test('it parses dependency names with multiple slashes correctly', () => {
  const error = new DependencyError('redux-form/immutable/koekjes');

  expect(error.payload).toEqual({ dependency: 'redux-form' });
});
