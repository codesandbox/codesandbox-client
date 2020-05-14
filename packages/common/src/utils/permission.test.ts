import { hasPermission } from './permission';

describe('permission', () => {
  it('correctly accepts a lower permission', () => {
    expect(hasPermission('write_code', 'read')).toBe(true);
    expect(hasPermission('write_code', 'write_code')).toBe(true);
    expect(hasPermission('write_project', 'comment')).toBe(true);
  });

  it('correctly rejects a a permission', () => {
    expect(hasPermission('read', 'write_code')).toBe(false);
    expect(hasPermission('read', 'comment')).toBe(false);
  });
});
