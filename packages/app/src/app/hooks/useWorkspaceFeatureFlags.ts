import { useAppState } from 'app/overmind';

export type FeatureFlags = {
  blockRepoImport: boolean;
  blockBranchCreation: boolean;
  ubbBeta: boolean;
  friendOfCsb: boolean;
};

export const useWorkspaceFeatureFlags = (): FeatureFlags => {
  const { activeTeamInfo } = useAppState();

  if (!activeTeamInfo) {
    return {
      blockRepoImport: false,
      blockBranchCreation: false,
      ubbBeta: false,
      friendOfCsb: false,
    };
  }

  return {
    blockRepoImport: activeTeamInfo.featureFlags.blockRepoImport,
    blockBranchCreation: activeTeamInfo.featureFlags.blockBranchCreation,
    ubbBeta: activeTeamInfo.featureFlags.ubbBeta,
    friendOfCsb: activeTeamInfo.featureFlags.friendOfCsb,
  };
};
