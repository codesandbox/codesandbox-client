import { useAppState } from 'app/overmind';
import { useWorkspaceSubscription } from './useWorkspaceSubscription';
import { useWorkspaceFeatureFlags } from './useWorkspaceFeatureFlags';

const OUT_OF_CREDITS_TRESHOLD = 50; // 50 credits left from the free plan included credits
const SPENDING_LIMIT_WARNING = 0.9; // 90% of the included + ondemand credits used

export const useWorkspaceLimits = (): WorkspaceLimitsReturn => {
  const { activeTeamInfo, user } = useAppState();
  const { isFree, isPro } = useWorkspaceSubscription();
  const { ubbBeta, friendOfCsb } = useWorkspaceFeatureFlags();

  if (!activeTeamInfo || !user) {
    return {
      isOutOfCredits: undefined,
      isCloseToOutOfCredits: undefined,
      isAtSpendingLimit: undefined,
      isCloseToSpendingLimit: undefined,
      showUsageLimitBanner: undefined,
      isFrozen: undefined,
      highestAllowedVMTier: undefined,
    };
  }

  const applyUbbRestrictions = !friendOfCsb && ubbBeta;

  const { limits, usage, frozen } = activeTeamInfo;

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

  const highestAllowedVMTier = limits.includedVmTier;

  return {
    isOutOfCredits,
    isCloseToOutOfCredits,
    isAtSpendingLimit,
    isCloseToSpendingLimit,
    showUsageLimitBanner:
      isOutOfCredits ||
      isCloseToOutOfCredits ||
      isAtSpendingLimit ||
      isCloseToSpendingLimit,
    isFrozen: applyUbbRestrictions && frozen,
    highestAllowedVMTier,
  };
};

export type WorkspaceLimitsReturn =
  | {
      isOutOfCredits: undefined;
      isCloseToOutOfCredits: undefined;
      isAtSpendingLimit: undefined;
      isCloseToSpendingLimit: undefined;
      showUsageLimitBanner: undefined;
      isFrozen: undefined;
      highestAllowedVMTier: undefined;
    }
  | {
      isOutOfCredits: boolean;
      isCloseToOutOfCredits: boolean;
      isAtSpendingLimit: boolean;
      isCloseToSpendingLimit: boolean;
      showUsageLimitBanner: boolean;
      isFrozen: boolean;
      highestAllowedVMTier: number;
    };
