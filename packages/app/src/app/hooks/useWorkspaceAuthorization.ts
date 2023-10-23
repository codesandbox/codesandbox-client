import { TeamMemberAuthorization } from 'app/graphql/types';
import { useAppState } from 'app/overmind';

type WorkspaceAuthorizationReturn = {
  isAdmin: boolean;
  isBillingManager: boolean;
  isPersonalSpace: boolean;
  isTeamSpace: boolean;
  isTeamAdmin: boolean;
  isTeamEditor: boolean;
  isTeamViewer: boolean;
  userRole: TeamMemberAuthorization | null;
};

export const useWorkspaceAuthorization = (): WorkspaceAuthorizationReturn => {
  const { activeTeamInfo, user } = useAppState();

  const { authorization, teamManager } =
    activeTeamInfo?.userAuthorizations.find(auth => auth.userId === user?.id) ??
    {};

  /**
   * TODO: Remove when all references are cleaned
   */

  const isPersonalSpace = false;

  const isAdmin = authorization === TeamMemberAuthorization.Admin;

  /**
   * TODO: Remove when all references are cleaned
   */

  const isTeamSpace = activeTeamInfo !== null && !isPersonalSpace;

  const isTeamAdmin = isTeamSpace && isAdmin;

  const isTeamEditor =
    isTeamSpace && authorization === TeamMemberAuthorization.Write;

  const isTeamViewer =
    isTeamSpace && authorization === TeamMemberAuthorization.Read;

  return {
    isBillingManager: Boolean(teamManager) || isAdmin,
    isAdmin,
    isPersonalSpace,
    isTeamSpace,
    isTeamAdmin,
    isTeamEditor,
    isTeamViewer,
    userRole: authorization ?? null,
  };
};
