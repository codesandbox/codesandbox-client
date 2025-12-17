import { useAppState } from 'app/overmind';

export type ActiveTeamInfo = {
  id: string | null;
  name: string | null;
  sdkWorkspace: boolean;
  frozen: boolean;
};

/**
 * Hook to access active team information.
 * 
 * This hook provides an abstraction layer over the Overmind state,
 * making it easier to migrate away from Overmind in the future.
 * 
 * @returns Active team information or null values if no team is active
 */
export const useActiveTeamInfo = (): ActiveTeamInfo => {
  const { activeTeamInfo } = useAppState();

  if (!activeTeamInfo) {
    return {
      id: null,
      name: null,
      sdkWorkspace: false,
      frozen: false,
    };
  }

  return {
    id: activeTeamInfo.id,
    name: activeTeamInfo.name,
    sdkWorkspace: activeTeamInfo.sdkWorkspace ?? false,
    frozen: activeTeamInfo.frozen,
  };
};

