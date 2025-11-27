import { useQuery } from '@apollo/react-hooks';
import {
  RecentTemplatesQuery,
  RecentTemplatesQueryVariables,
  TeamTemplatesForCreateQuery,
  TeamTemplatesForCreateQueryVariables,
} from 'app/graphql/types';
import {
  FETCH_RECENT_TEMPLATES,
  FETCH_TEAM_TEMPLATES,
} from '../utils/queries';
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

  const {
    data: recentData,
    error: recentError,
  } = useQuery<RecentTemplatesQuery, RecentTemplatesQueryVariables>(
    FETCH_RECENT_TEMPLATES,
    {
      variables: { teamId },
      fetchPolicy: 'cache-and-network',
      skip,
    }
  );

  const {
    data: teamData,
    error: teamError,
  } = useQuery<
    TeamTemplatesForCreateQuery,
    TeamTemplatesForCreateQueryVariables
  >(FETCH_TEAM_TEMPLATES, {
    variables: { id: teamId },
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

  // If either query has an error, return error state
  if (recentError || teamError) {
    return {
      state: 'error',
      recentTemplates: [],
      teamTemplates: [],
      error: recentError?.message || teamError?.message || 'Unknown error',
    };
  }

  // Check if both queries have loaded data
  const recentLoaded = typeof recentData?.me !== 'undefined';
  const teamLoaded = typeof teamData?.me !== 'undefined';

  // If neither has loaded yet, show loading state
  if (!recentLoaded && !teamLoaded) {
    return {
      state: 'loading',
      recentTemplates: [],
      teamTemplates: [],
    };
  }

  // Return ready state with available data (partial data is okay)
  // Apply client-side limits since schema doesn't support limit parameters
  const recentLimit = 10; // Fetch more than 4 for better UX
  const teamLimit = 50; // Reasonable limit for team templates

  return {
    state: 'ready',
    recentTemplates: recentData?.me?.recentlyUsedTemplates
      ? recentData.me.recentlyUsedTemplates
          .slice(0, recentLimit)
          .map(mapTemplateGQLResponseToSandboxToFork)
      : [],
    teamTemplates: teamData?.me?.team?.templates
      ? teamData.me.team.templates
          .slice(0, teamLimit)
          .map(mapTemplateGQLResponseToSandboxToFork)
      : [],
  };
};
