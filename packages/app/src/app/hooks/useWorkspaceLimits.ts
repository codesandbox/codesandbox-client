import { useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';
import { useWorkspaceFeatureFlags } from './useWorkspaceFeatureFlags';

const OUT_OF_CREDITS_TRESHOLD = 50; // 50 credits left from the free plan included credits
const SPENDING_LIMIT_WARNING = 0.9; // 90% of the included + ondemand credits used

export const useWorkspaceLimits = (): WorkspaceLimitsReturn => {
  const { activeTeamInfo } = useAppState();
  const { isFree, isPro } = useWorkspaceSubscription();
  const { ubbBeta, friendOfCsb } = useWorkspaceFeatureFlags();

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
      hasRestrictedSandboxes: undefined,
    };
  }

  // Will be replaced with a check on the subscription if it's ubb or not
  const applyUbbRestrictions = !friendOfCsb && ubbBeta;

  const { limits, usage, frozen } = activeTeamInfo;

  const hasOver20Sandboxes = applyUbbRestrictions && usage.sandboxes > 20;
  const hasOver200Sandboxes = applyUbbRestrictions && usage.sandboxes > 200;

  const isOutOfCredits = applyUbbRestrictions && isFree === true && frozen;
  const isCloseToOutOfCredits =
    applyUbbRestrictions &&
    isFree === true &&
    !frozen &&
    limits.includedCredits - usage.credits < OUT_OF_CREDITS_TRESHOLD;
  const isAtSpendingLimit = applyUbbRestrictions && isPro === true && frozen;

  const onDemandCreditsLimit = limits.onDemandCreditLimit ?? 0;
  const isCloseToSpendingLimit =
    applyUbbRestrictions &&
    isPro === true &&
    !frozen &&
    usage.credits / (limits.includedCredits + onDemandCreditsLimit) >
      SPENDING_LIMIT_WARNING;

  const hasRestrictedSandboxes =
    applyUbbRestrictions && usage.sandboxes > limits.includedSandboxes;

  return {
    hasOver20Sandboxes,
    hasOver200Sandboxes,
    isOutOfCredits,
    isCloseToOutOfCredits,
    isAtSpendingLimit,
    isCloseToSpendingLimit,
    hasRestrictedSandboxes,
    showUsageLimitBanner:
      isOutOfCredits ||
      isCloseToOutOfCredits ||
      isAtSpendingLimit ||
      isCloseToSpendingLimit,
    isFrozen: applyUbbRestrictions && frozen,
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
      hasRestrictedSandboxes: undefined;
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
      hasRestrictedSandboxes: boolean;
    };
