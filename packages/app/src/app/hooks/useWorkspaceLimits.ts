import { useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';

const OUT_OF_CREDITS_TRESHOLD = 50; // 50 credits left from the free plan included credits
const SPENDING_LIMIT_WARNING = 0.9; // 90% of the included + ondemand credits used

export const useWorkspaceLimits = (): WorkspaceLimitsReturn => {
  const { activeTeamInfo } = useAppState();
  const { isFree, isPro } = useWorkspaceSubscription();

  if (!activeTeamInfo) {
    return {
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

  const { limits, usage, frozen } = activeTeamInfo;

  const hasOver20Sandboxes = isFree === true && usage.sandboxes > 20;
  const hasOver200Sandboxes = isFree === true && usage.sandboxes > 200;

  const isOutOfCredits = isFree === true && frozen;
  const isCloseToOutOfCredits =
    isFree === true &&
    !frozen &&
    limits.includedCredits - usage.credits < OUT_OF_CREDITS_TRESHOLD;
  const isAtSpendingLimit = isPro === true && frozen;
  const isCloseToSpendingLimit =
    isPro === true &&
    usage.credits / (limits.includedCredits + limits.onDemandCreditLimit) >
      SPENDING_LIMIT_WARNING;

  return {
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
      hasOver20Sandboxes: boolean;
      hasOver200Sandboxes: boolean;
      isOutOfCredits: boolean;
      isCloseToOutOfCredits: boolean;
      isAtSpendingLimit: boolean;
      isCloseToSpendingLimit: boolean;
      showUsageLimitBanner: boolean;
      isFrozen: boolean;
    };
