import DependencyError from './dependency-not-found-error';

test('it handles normal deps correctly', () => {
  const error = new DependencyError('redux-form');

  expect(error.message).toMatchSnapshot();
});

test('it parses dependency names with slashes correctly', () => {
  const error = new DependencyError('redux-form/immutable');

  expect(error.message).toMatchSnapshot();
});

test('it parses dependency names with multiple slashes correctly', () => {
  const error = new DependencyError('redux-form/immutable/koekjes');

  expect(error.message).toMatchSnapshot();
});

test('it parses scoped packages', () => {
  const error = new DependencyError('@vx/group');

  expect(error.message).toMatchSnapshot();
});
