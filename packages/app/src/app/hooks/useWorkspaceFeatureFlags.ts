import { useAppState } from 'app/overmind';

export type FeatureFlags =
  | {
      ubbBeta: undefined;
      friendOfCsb: undefined;
    }
  | {
      ubbBeta: boolean;
      friendOfCsb: boolean;
    };

export const useWorkspaceFeatureFlags = (): FeatureFlags => {
  const { activeTeamInfo } = useAppState();

  if (!activeTeamInfo) {
    return {
      ubbBeta: undefined,
      friendOfCsb: undefined,
    };
  }

  return {
    ubbBeta: activeTeamInfo.featureFlags.ubbBeta,
    friendOfCsb: activeTeamInfo.featureFlags.friendOfCsb,
  };
};
