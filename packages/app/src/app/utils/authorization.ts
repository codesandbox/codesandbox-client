import { PermissionType } from '@codesandbox/common/es/types';
import { Authorization } from 'app/graphql/types';

export function convertAuthorizationToPermissionType(
  auth: Authorization
): PermissionType {
  return auth.toLowerCase() as PermissionType;
}
