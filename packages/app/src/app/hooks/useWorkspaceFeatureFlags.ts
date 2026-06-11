import { useAppState } from 'app/overmind';

export type FeatureFlags = {
  blockRepoImport: boolean;
  disableBranchCreation: boolean;
  ubbBeta: boolean;
  friendOfCsb: boolean;
};

export const useWorkspaceFeatureFlags = (): FeatureFlags => {
  const { activeTeamInfo } = useAppState();

  if (!activeTeamInfo) {
    return {
      blockRepoImport: false,
      disableBranchCreation: false,
      ubbBeta: false,
      friendOfCsb: false,
    };
  }

  return {
    blockRepoImport: activeTeamInfo.featureFlags.blockRepoImport,
    disableBranchCreation: activeTeamInfo.featureFlags.disableBranchCreation,
    ubbBeta: activeTeamInfo.featureFlags.ubbBeta,
    friendOfCsb: activeTeamInfo.featureFlags.friendOfCsb,
  };
};
