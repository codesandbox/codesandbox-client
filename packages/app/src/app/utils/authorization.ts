import { Authorization } from 'app/graphql/types';
import { PermissionType } from '@codesandbox/common/lib/types';

export function convertAuthorizationToPermissionType(
  auth: Authorization
): PermissionType {
  return auth.toLowerCase() as PermissionType;
}
