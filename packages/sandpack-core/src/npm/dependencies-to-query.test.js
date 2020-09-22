import dependenciesToQuery from './dependencies-to-query';

it('creates a right query', () => {
  const packages = {
    react: 'latest',
    'react-dom': '15.5.3',
    '@angular/core': '14.0.0',
  };

  expect(dependenciesToQuery(packages)).toMatchSnapshot();
});
