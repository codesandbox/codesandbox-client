import dependenciesToQuery, { normalizeVersion } from './dependencies-to-query';

it('Normalize version', () => {
  expect(normalizeVersion('^=12386.123.54-alpha.1+12487g78')).toBe(
    '12386.123.54-alpha.1'
  );
  expect(normalizeVersion('1.2.4')).toBe('1.2.4');
  expect(normalizeVersion('>=12.56.87-beta')).toBe('12.56.87-beta');
  expect(normalizeVersion('>=1.0.12-beta.5.4')).toBe('1.0.12-beta.5.4');
  expect(normalizeVersion('>=1.0.0-beta-15')).toBe('1.0.0-beta-15');
});

it('creates the right query', () => {
  const packages = {
    react: 'latest',
    'react-dom': '15.5.3',
    '@angular/core': '14.0.0',
  };

  expect(dependenciesToQuery(packages)).toBe(
    '%40angular%2Fcore%4014.0.0+react%40latest+react-dom%4015.5.3'
  );
});
