import { TeamMemberAuthorization } from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { useWorkspaceAuthorization } from './useWorkspaceAuthorization';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';

export const useWorkspaceLimits = (): WorkspaceLimitsReturn => {
  const { activeTeamInfo } = useAppState();
  const { isTeamSpace } = useWorkspaceAuthorization();
  const { isFree } = useWorkspaceSubscription();

  if (!activeTeamInfo) {
    return {
      numberOfEditors: undefined,
      hasMaxNumberOfEditors: undefined,
      numberOfEditorsIsOverTheLimit: undefined,
      hasMaxPublicRepositories: undefined,
      hasMaxPublicSandboxes: undefined,
    };
  }

  const { userAuthorizations, limits, usage } = activeTeamInfo;

  const editorOrAdminAuthorizations = userAuthorizations?.filter(
    ({ authorization }) =>
      authorization === TeamMemberAuthorization.Admin ||
      authorization === TeamMemberAuthorization.Write
  );
  const numberOfEditors = isTeamSpace
    ? editorOrAdminAuthorizations?.length || 1
    : 1; // Personal

  const hasMaxNumberOfEditors =
    isFree === true && numberOfEditors === limits.maxEditors;

  const numberOfEditorsIsOverTheLimit =
    isFree === true &&
    limits.maxEditors !== null &&
    numberOfEditors > limits.maxEditors;

  const publicProjectsQuantity = usage.publicProjectsQuantity;
  const maxPublicProjects = limits.maxPublicProjects;

  const hasMaxPublicRepositories =
    isFree === true &&
    maxPublicProjects !== null &&
    publicProjectsQuantity >= maxPublicProjects;

  const publicSandboxesQuantity = usage.publicSandboxesQuantity;
  const maxPublicSandboxes = limits.maxPublicSandboxes;

  const hasMaxPublicSandboxes =
    isFree === true &&
    maxPublicSandboxes !== null &&
    publicSandboxesQuantity >= maxPublicSandboxes;

  return {
    numberOfEditors,
    hasMaxNumberOfEditors,
    numberOfEditorsIsOverTheLimit,
    hasMaxPublicRepositories,
    hasMaxPublicSandboxes,
  };
};

export type WorkspaceLimitsReturn =
  | {
      numberOfEditors: undefined;
      hasMaxNumberOfEditors: undefined;
      numberOfEditorsIsOverTheLimit: undefined;
      hasMaxPublicRepositories: undefined;
      hasMaxPublicSandboxes: undefined;
    }
  | {
      numberOfEditors: number;
      hasMaxNumberOfEditors: boolean;
      numberOfEditorsIsOverTheLimit: boolean;
      hasMaxPublicRepositories: boolean;
      hasMaxPublicSandboxes: boolean;
    };
