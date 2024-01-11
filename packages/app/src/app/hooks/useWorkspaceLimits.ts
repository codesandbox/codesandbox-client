import { TeamMemberAuthorization } from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { folder, useControls } from 'leva';
import {
  SubscriptionDebugStatus,
  useWorkspaceSubscription,
} from './useWorkspaceSubscription';

export const useWorkspaceLimits = (): WorkspaceLimitsReturn => {
  const { activeTeamInfo } = useAppState();
  const { isFree } = useWorkspaceSubscription();
  const debugLimits = useControls('Limits', {
    debugLimits: folder(
      {
        restrictEditors: { label: 'Restrict editors', value: false },
        hasMaxPublicRepositories: {
          label: 'Restrict public repos',
          value: false,
        },
        hasMaxPrivateRepositories: {
          label: 'Restrict private repos',
          value: false,
        },
        hasMaxPublicSandboxes: {
          label: 'Restrict public sandboxes',
          value: false,
        },
      },
      {
        render: get =>
          get('Subscription.debugStatus') ===
          SubscriptionDebugStatus.NO_SUBSCRIPTION,
      }
    ),
  });

  if (!activeTeamInfo) {
    return {
      numberOfEditors: undefined,
      hasMaxNumberOfEditors: undefined,
      numberOfEditorsIsOverTheLimit: undefined,
      hasOver20Sandboxes: undefined,
      hasOver200Sandboxes: undefined,
    };
  }

  const { userAuthorizations, limits, usage } = activeTeamInfo;

  const editorOrAdminAuthorizations = userAuthorizations?.filter(
    ({ authorization }) =>
      authorization === TeamMemberAuthorization.Admin ||
      authorization === TeamMemberAuthorization.Write
  );

  const numberOfEditors = editorOrAdminAuthorizations?.length || 1;

  const hasMaxNumberOfEditors =
    debugLimits?.restrictEditors ||
    (isFree === true && numberOfEditors === limits.maxEditors);

  const numberOfEditorsIsOverTheLimit =
    debugLimits?.restrictEditors ||
    (isFree === true &&
      limits.maxEditors !== null &&
      numberOfEditors > limits.maxEditors);

  const publicSandboxesQuantity = usage.publicSandboxesQuantity;

  const hasOver20Sandboxes = isFree === true && publicSandboxesQuantity > 20;
  const hasOver200Sandboxes = isFree === true && publicSandboxesQuantity > 200;

  return {
    numberOfEditors,
    hasMaxNumberOfEditors,
    numberOfEditorsIsOverTheLimit,
    hasOver20Sandboxes,
    hasOver200Sandboxes,
  };
};

export type WorkspaceLimitsReturn =
  | {
      numberOfEditors: number | undefined;
      hasMaxNumberOfEditors: undefined;
      numberOfEditorsIsOverTheLimit: undefined;
      hasOver20Sandboxes: undefined;
      hasOver200Sandboxes: undefined;
    }
  | {
      numberOfEditors: number;
      hasMaxNumberOfEditors: boolean;
      numberOfEditorsIsOverTheLimit: boolean;
      hasOver20Sandboxes: boolean;
      hasOver200Sandboxes: boolean;
    };
