import { useQuery } from '@apollo/react-hooks';
import {
  RecentAndWorkspaceTemplatesQuery,
  RecentAndWorkspaceTemplatesQueryVariables,
} from 'app/graphql/types';
import { FETCH_TEAM_TEMPLATES } from '../utils/queries';
import { SandboxToFork } from '../utils/types';
import { mapTemplateGQLResponseToSandboxToFork } from '../utils/api';

type BaseState = {
  recentTemplates: SandboxToFork[];
  teamTemplates: SandboxToFork[];
};

type State = BaseState &
  (
    | { state: 'idle' }
    | {
        state: 'loading';
      }
    | {
        state: 'ready';
      }
    | {
        state: 'error';
        error: string;
      }
  );

type UseTeamTemplatesParams = {
  teamId: string;
  hasLogIn: boolean;
};

export const useTeamTemplates = ({
  teamId,
  hasLogIn,
}: UseTeamTemplatesParams): State => {
  const skip = !hasLogIn;

  const { data, error } = useQuery<
    RecentAndWorkspaceTemplatesQuery,
    RecentAndWorkspaceTemplatesQueryVariables
  >(FETCH_TEAM_TEMPLATES, {
    variables: { teamId },
    fetchPolicy: 'cache-and-network',
    skip,
  });

  if (skip) {
    return {
      state: 'idle',
      recentTemplates: [],
      teamTemplates: [],
    };
  }

  if (error) {
    return {
      state: 'error',
      recentTemplates: [],
      teamTemplates: [],
      error: error.message,
    };
  }

  // Instead of checking the loading var we check this. Apollo sets the loading
  // var to true even if we still have cached data that we can use. We  also need to
  // check if `data.me` isnt undefined before getting templates.
  if (typeof data?.me === 'undefined') {
    return {
      state: 'loading',
      recentTemplates: [],
      teamTemplates: [],
    };
  }

  return {
    state: 'ready',
    recentTemplates: data.me.recentlyUsedTemplates.map(
      mapTemplateGQLResponseToSandboxToFork
    ),
    teamTemplates: data.me.team.templates.map(
      mapTemplateGQLResponseToSandboxToFork
    ),
  };
};
