import * as dashboard from './dashboard';

const teamId = 'foo-bar-123';

describe('dashboard url generator', () => {
  test('sandboxes', () => {
    expect(dashboard.sandboxes('/path', teamId)).toBe(
      '/dashboard/sandboxes/path?workspace=foo-bar-123'
    );
  });

  test('recent', () => {
    expect(dashboard.recent(teamId)).toBe(
      '/dashboard/recent?workspace=foo-bar-123'
    );
  });

  test('recent with extra params', () => {
    expect(dashboard.recent(teamId, { create_team: 'true' })).toBe(
      '/dashboard/recent?workspace=foo-bar-123&create_team=true'
    );
  });

  test('search', () => {
    expect(dashboard.search('foo', teamId)).toBe(
      '/dashboard/search?workspace=foo-bar-123&query=foo'
    );
  });

  test('discover', () => {
    expect(dashboard.discover(teamId, 'album-1')).toBe(
      '/dashboard/discover/album-1?workspace=foo-bar-123'
    );
  });

  test('discoverSearch', () => {
    expect(dashboard.discoverSearch('foo', teamId)).toBe(
      '/dashboard/discover/search?workspace=foo-bar-123&query=foo'
    );
  });
});
