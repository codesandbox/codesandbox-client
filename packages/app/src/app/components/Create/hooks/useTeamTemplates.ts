import { useQuery } from '@apollo/react-hooks';
import {
  RecentAndWorkspaceTemplatesQuery,
  RecentAndWorkspaceTemplatesQueryVariables,
  TemplateFragment,
} from 'app/graphql/types';
import { FETCH_TEAM_TEMPLATES } from '../utils/queries';

type BaseState = {
  recentTemplates: TemplateFragment[];
  teamTemplates: TemplateFragment[];
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
  type: 'devbox' | 'sandbox';
};

export const useTeamTemplates = ({
  teamId,
  hasLogIn,
  type,
}: UseTeamTemplatesParams): State => {
  const skip = !hasLogIn;

  const noDevboxesWhenListingSandboxes = (t: TemplateFragment) =>
    type === 'sandbox' ? !t.sandbox.isV2 : true;

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
    recentTemplates: data.me.recentlyUsedTemplates.filter(
      noDevboxesWhenListingSandboxes
    ),
    teamTemplates: data.me.team.templates.filter(
      noDevboxesWhenListingSandboxes
    ),
  };
};
