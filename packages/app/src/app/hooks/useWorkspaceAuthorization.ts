import { TeamMemberAuthorization } from 'app/graphql/types';
import { useAppState } from 'app/overmind';

export const useWorkspaceAuthorization = () => {
  const { activeTeamInfo, personalWorkspaceId, user } = useAppState();

  const { authorization, teamManager } =
    activeTeamInfo?.userAuthorizations.find(auth => auth.userId === user?.id) ??
    {};

  /**
   * Personal states
   */

  const isPersonalSpace = activeTeamInfo?.id === personalWorkspaceId;

  /**
   * User states
   */

  const isAdmin = authorization === TeamMemberAuthorization.Admin;

  /**
   * Team states
   */

  const isTeamSpace = activeTeam !== null && !isPersonalSpace;

  const isTeamAdmin = isTeamSpace && isAdmin;

  const isTeamEditor =
    isTeamSpace && authorization === TeamMemberAuthorization.Write;

  const isTeamViewer =
    isTeamSpace && authorization === TeamMemberAuthorization.Read;

  return {
    isPersonalSpace,
    isTeamSpace,
    isTeamAdmin,
    isTeamEditor,
    isBillingManager: Boolean(teamManager),
    isTeamViewer,
    isAdmin,
    userRole: authorization ?? null,
  };
};
