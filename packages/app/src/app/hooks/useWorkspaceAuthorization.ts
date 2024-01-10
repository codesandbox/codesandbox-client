import { TeamMemberAuthorization, TeamType } from 'app/graphql/types';
import { useAppState } from 'app/overmind';

type WorkspaceAuthorizationReturn = {
  isAdmin: boolean;
  isBillingManager: boolean;
  isPersonalSpace: boolean;
  isPrimarySpace: boolean;
  isTeamAdmin: boolean;
  isTeamEditor: boolean;
  isTeamViewer: boolean;
  userRole: TeamMemberAuthorization | null;
};

export const useWorkspaceAuthorization = (): WorkspaceAuthorizationReturn => {
  const {
    activeTeamInfo,
    user,
    activeTeam,
    primaryWorkspaceId,
  } = useAppState();

  const { authorization, teamManager } =
    activeTeamInfo?.userAuthorizations.find(auth => auth.userId === user?.id) ??
    {};

  /**
   * TODO: Drop the team prefix from all these flags and replace all ocurrences
   */

  const isAdmin = authorization === TeamMemberAuthorization.Admin;

  const isTeamAdmin = isAdmin;

  const isTeamEditor = authorization === TeamMemberAuthorization.Write;

  const isTeamViewer = authorization === TeamMemberAuthorization.Read;

  return {
    isBillingManager: Boolean(teamManager) || isAdmin,
    isAdmin,
    isPersonalSpace: activeTeamInfo?.type === TeamType.Personal,
    isPrimarySpace: activeTeam === primaryWorkspaceId,
    isTeamAdmin,
    isTeamEditor,
    isTeamViewer,
    userRole: authorization ?? null,
  };
};
