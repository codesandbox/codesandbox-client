import { useAppState } from 'app/overmind';

export type FeatureFlags = {
  ubbBeta: boolean;
  friendOfCsb: boolean;
};

export const useWorkspaceFeatureFlags = (): FeatureFlags => {
  const { activeTeamInfo } = useAppState();

  if (!activeTeamInfo) {
    return {
      ubbBeta: false,
      friendOfCsb: false,
    };
  }

  return {
    ubbBeta: activeTeamInfo.featureFlags.ubbBeta,
    friendOfCsb: activeTeamInfo.featureFlags.friendOfCsb,
  };
};
