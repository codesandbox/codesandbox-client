import { TeamMemberAuthorization } from 'app/graphql/types';
import { useAppState } from 'app/overmind';

type WorkspaceAuthorizationReturn =
  | {
      isAdmin: undefined;
      isBillingManager: undefined;
      isPrimarySpace: undefined;
      isTeamAdmin: undefined;
      isTeamEditor: undefined;
      isTeamViewer: undefined;
      userRole: undefined;
    }
  | {
      isAdmin: boolean;
      isBillingManager: boolean;
      isPrimarySpace: boolean;
      isTeamAdmin: boolean;
      isTeamEditor: boolean;
      isTeamViewer: boolean;
      userRole: TeamMemberAuthorization;
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

  if (!authorization) {
    return {
      isAdmin: undefined,
      isBillingManager: undefined,
      isPrimarySpace: undefined,
      isTeamAdmin: undefined,
      isTeamEditor: undefined,
      isTeamViewer: undefined,
      userRole: undefined,
    };
  }

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
    isPrimarySpace: activeTeam === primaryWorkspaceId,
    isTeamAdmin,
    isTeamEditor,
    isTeamViewer,
    userRole: authorization ?? undefined,
  };
};
