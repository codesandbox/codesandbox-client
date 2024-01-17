import { TeamMemberAuthorization } from 'app/graphql/types';
import { useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';

export const useWorkspaceLimits = (): WorkspaceLimitsReturn => {
  const { activeTeamInfo } = useAppState();
  const { isFree, isPro } = useWorkspaceSubscription();

  if (!activeTeamInfo) {
    return {
      numberOfEditors: undefined,
      hasMaxNumberOfEditors: undefined,
      numberOfEditorsIsOverTheLimit: undefined,
      hasOver20Sandboxes: undefined,
      hasOver200Sandboxes: undefined,
      isOutOfCredits: undefined,
      isCloseToOutOfCredits: undefined,
      isAtSpendingLimit: undefined,
      isCloseToSpendingLimit: undefined,
      showUsageLimitBanner: undefined,
      isFrozen: undefined,
    };
  }

  const { userAuthorizations, limits, usage, frozen } = activeTeamInfo;

  const editorOrAdminAuthorizations = userAuthorizations?.filter(
    ({ authorization }) =>
      authorization === TeamMemberAuthorization.Admin ||
      authorization === TeamMemberAuthorization.Write
  );

  const numberOfEditors = editorOrAdminAuthorizations?.length || 1;

  const hasMaxNumberOfEditors =
    isFree === true && numberOfEditors === limits.maxEditors;

  const numberOfEditorsIsOverTheLimit =
    isFree === true &&
    limits.maxEditors !== null &&
    numberOfEditors > limits.maxEditors;

  const publicSandboxesQuantity = usage.publicSandboxesQuantity;

  const hasOver20Sandboxes = isFree === true && publicSandboxesQuantity > 20;
  const hasOver200Sandboxes = isFree === true && publicSandboxesQuantity > 200;

  const isOutOfCredits = isFree === true && frozen;
  const isCloseToOutOfCredits =
    isFree === true && !frozen && usage.credits > 350; // TODO: this is a random pick for now
  const isAtSpendingLimit = isPro === true && frozen;
  const isCloseToSpendingLimit = false; // TODO

  return {
    numberOfEditors,
    hasMaxNumberOfEditors,
    numberOfEditorsIsOverTheLimit,
    hasOver20Sandboxes,
    hasOver200Sandboxes,
    isOutOfCredits,
    isCloseToOutOfCredits,
    isAtSpendingLimit,
    isCloseToSpendingLimit,
    showUsageLimitBanner:
      isOutOfCredits ||
      isCloseToOutOfCredits ||
      isAtSpendingLimit ||
      isCloseToSpendingLimit,
    isFrozen: frozen,
  };
};

export type WorkspaceLimitsReturn =
  | {
      numberOfEditors: number | undefined;
      hasMaxNumberOfEditors: undefined;
      numberOfEditorsIsOverTheLimit: undefined;
      hasOver20Sandboxes: undefined;
      hasOver200Sandboxes: undefined;
      isOutOfCredits: undefined;
      isCloseToOutOfCredits: undefined;
      isAtSpendingLimit: undefined;
      isCloseToSpendingLimit: undefined;
      showUsageLimitBanner: undefined;
      isFrozen: undefined;
    }
  | {
      numberOfEditors: number;
      hasMaxNumberOfEditors: boolean;
      numberOfEditorsIsOverTheLimit: boolean;
      hasOver20Sandboxes: boolean;
      hasOver200Sandboxes: boolean;
      isOutOfCredits: boolean;
      isCloseToOutOfCredits: boolean;
      isAtSpendingLimit: boolean;
      isCloseToSpendingLimit: boolean;
      showUsageLimitBanner: boolean;
      isFrozen: boolean;
    };
