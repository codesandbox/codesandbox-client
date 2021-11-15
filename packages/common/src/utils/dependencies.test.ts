import { isAbsoluteVersion } from './dependencies';

describe('dependencies', () => {
  describe('isAbsoluteVersion', () => {
    it('returns true on absolute versions', () => {
      expect(isAbsoluteVersion('1.1.0')).toBe(true);
      expect(isAbsoluteVersion('154.78.7896')).toBe(true);
      expect(isAbsoluteVersion('1.1.0-next.1')).toBe(true);
      expect(isAbsoluteVersion('154.78.123-alpha.1-235f8723g5oi23')).toBe(true);
    });

    it('returns false on non-absolute versions', () => {
      expect(isAbsoluteVersion('^1.1.0')).toBe(false);
      expect(isAbsoluteVersion('1')).toBe(false);
      expect(isAbsoluteVersion('~1.8.1')).toBe(false);
      expect(isAbsoluteVersion('>=15.72.81')).toBe(false);
    });
  });
});
