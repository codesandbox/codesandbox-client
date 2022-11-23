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

  const isTeamSpace = activeTeam && !isPersonalSpace;

  const isTeamAdmin =
    isTeamSpace &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Admin;

  const isTeamEditor =
    isTeamSpace &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Write;

  return {
    isPersonalSpace,
    isTeamSpace,
    isTeamAdmin,
    isTeamEditor,
    userRole: activeWorkspaceAuthorization,
  };
};
