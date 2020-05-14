import { PermissionType } from '../types';

const permissions: PermissionType[] = [
  'write_code',
  'write_project',
  'comment',
  'read',
  'none',
];

/**
 * Whether the given permission is permitted compared to the required permission.
 * We use a simple model for this, where if you have a top permission it will be considered
 * that you have all other permissions. This same list is saved on the server, and this needs
 * to keep in sync with that.
 * @param permission Permission to test
 * @param requiredPermission Required permission to pass the test
 */
export function hasPermission(
  permission: PermissionType,
  requiredPermission: PermissionType
) {
  return (
    permissions.indexOf(permission) <= permissions.indexOf(requiredPermission)
  );
}
