import { useAppState } from 'app/overmind';

export type FeatureFlags =
  | {
      ubbBeta: undefined;
    }
  | {
      ubbBeta: boolean;
    };

export const useWorkspaceFeatureFlags = (): FeatureFlags => {
  const { activeTeamInfo } = useAppState();

  if (!activeTeamInfo) {
    return {
      ubbBeta: undefined,
    };
  }

  return {
    ubbBeta: activeTeamInfo.featureFlags.ubbBeta,
  };
};
