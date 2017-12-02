import getDependencyName from './get-dependency-name';

describe('getDependencyName', () => {
  it('can find a simple dependency name', () => {
    expect(getDependencyName('lodash/test')).toBe('lodash');
  });

  it('can find a simple dependency name from no path', () => {
    expect(getDependencyName('lodash')).toBe('lodash');
  });

  it('can find a simple dependency name from an organization', () => {
    expect(getDependencyName('@angular/core/test')).toBe('@angular/core');
  });

  it('can find a simple dependency name with a version', () => {
    expect(getDependencyName('lodash/4.4.3/test')).toBe('lodash/4.4.3');
  });

  it('can find a simple dependency name with a version from an organization', () => {
    expect(getDependencyName('@angular/core/4.4.3/test')).toBe(
      '@angular/core/4.4.3'
    );
  });
});
