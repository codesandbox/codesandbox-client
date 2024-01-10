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
      hasMaxPublicRepositories: undefined,
      hasMaxPrivateRepositories: undefined,
      hasMaxPublicSandboxes: undefined,
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

  const publicProjectsQuantity = usage.publicProjectsQuantity;
  const maxPublicProjects = limits.maxPublicProjects;

  const hasMaxPublicRepositories =
    debugLimits?.hasMaxPublicRepositories ||
    (isFree === true &&
      maxPublicProjects !== null &&
      publicProjectsQuantity >= maxPublicProjects);

  const privateRepositoriesQuantity = usage.privateProjectsQuantity;
  const maxPrivateRepositories = limits.maxPrivateProjects;

  const hasMaxPrivateRepositories =
    debugLimits?.hasMaxPrivateRepositories ||
    (isFree === true &&
      maxPrivateRepositories !== null &&
      privateRepositoriesQuantity > maxPrivateRepositories);

  const publicSandboxesQuantity = usage.publicSandboxesQuantity;
  const maxPublicSandboxes = limits.maxPublicSandboxes;

  const hasMaxPublicSandboxes =
    debugLimits?.hasMaxPublicSandboxes ||
    (isFree === true &&
      maxPublicSandboxes !== null &&
      publicSandboxesQuantity >= maxPublicSandboxes);

  return {
    numberOfEditors,
    hasMaxNumberOfEditors,
    numberOfEditorsIsOverTheLimit,
    hasMaxPublicRepositories,
    hasMaxPrivateRepositories,
    hasMaxPublicSandboxes,
  };
};

export type WorkspaceLimitsReturn =
  | {
      numberOfEditors: number | undefined;
      hasMaxNumberOfEditors: undefined;
      numberOfEditorsIsOverTheLimit: undefined;
      hasMaxPublicRepositories: undefined;
      hasMaxPrivateRepositories: undefined;
      hasMaxPublicSandboxes: undefined;
    }
  | {
      numberOfEditors: number;
      hasMaxNumberOfEditors: boolean;
      numberOfEditorsIsOverTheLimit: boolean;
      hasMaxPublicRepositories: boolean;
      hasMaxPrivateRepositories: boolean;
      hasMaxPublicSandboxes: boolean;
    };
