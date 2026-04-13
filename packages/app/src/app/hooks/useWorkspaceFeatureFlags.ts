import { useAppState } from 'app/overmind';

export type FeatureFlags = {
  blockRepoImport: boolean;
  ubbBeta: boolean;
  friendOfCsb: boolean;
};

export const useWorkspaceFeatureFlags = (): FeatureFlags => {
  const { activeTeamInfo } = useAppState();

  if (!activeTeamInfo) {
    return {
      blockRepoImport: false,
      ubbBeta: false,
      friendOfCsb: false,
    };
  }

  return {
    blockRepoImport: activeTeamInfo.featureFlags.blockRepoImport,
    ubbBeta: activeTeamInfo.featureFlags.ubbBeta,
    friendOfCsb: activeTeamInfo.featureFlags.friendOfCsb,
  };
};
