import { TeamMemberAuthorization } from 'app/graphql/types';
import { useAppState } from 'app/overmind';

export const useWorkspaceAuthorization = () => {
  const {
    activeTeam,
    personalWorkspaceId,
    activeWorkspaceAuthorization,
  } = useAppState();

  /**
   * Personal states
   */

  const isPersonalSpace = activeTeam === personalWorkspaceId;

  /**
   * Team states
   */

  const isTeamSpace = !isPersonalSpace;

  const isTeamAdmin =
    isTeamSpace &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Admin;

  return {
    isPersonalSpace,
    isTeamSpace,
    isTeamAdmin,
  };
};
