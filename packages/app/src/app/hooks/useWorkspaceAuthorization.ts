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
   * User states
   */

  const isAdmin =
    activeWorkspaceAuthorization === TeamMemberAuthorization.Admin;

  /**
   * Team states
   */

  const isTeamSpace = activeTeam !== null && !isPersonalSpace;

  const isTeamAdmin =
    isTeamSpace &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Admin;

  const isTeamEditor =
    isTeamSpace &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Write;

  const isTeamViewer =
    isTeamSpace &&
    activeWorkspaceAuthorization === TeamMemberAuthorization.Read;

  return {
    isPersonalSpace,
    isTeamSpace,
    isTeamAdmin,
    isTeamEditor,
    isTeamViewer,
    isAdmin,
    userRole: activeWorkspaceAuthorization,
  };
};
