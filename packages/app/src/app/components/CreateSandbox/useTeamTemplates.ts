import { useQuery } from '@apollo/client';
import {
  ListPersonalTemplatesQuery,
  ListPersonalTemplatesQueryVariables,
  TemplateFragment,
} from 'app/graphql/types';
import { LIST_PERSONAL_TEMPLATES } from './queries';

type State =
  | { state: 'loading' }
  | {
      state: 'ready';
      recentTemplates: TemplateFragment[];
      teamTemplates: TemplateFragment[];
    }
  | {
      state: 'error';
      error: string;
    };

function getUserTemplates(data: ListPersonalTemplatesQuery) {
  return data.me.templates;
}

function getTeamTemplates(data: ListPersonalTemplatesQuery, teamId: string) {
  return data.me.teams.find(team => team.id === teamId)?.templates || [];
}

type UseTeamTemplatesParams = {
  isUser: boolean;
  teamId?: string;
  hasLogIn: boolean;
};

export const useTeamTemplates = ({
  isUser,
  teamId,
  hasLogIn,
}: UseTeamTemplatesParams): State => {
  const { data, error } = useQuery<
    ListPersonalTemplatesQuery,
    ListPersonalTemplatesQueryVariables
  >(LIST_PERSONAL_TEMPLATES, {
    /**
     * With LIST_PERSONAL_TEMPLATES we're also fetching team templates. We're reusing
     * this query here because it has already been preloaded and cached by overmind. We're
     * filtering what we need later.
     */
    variables: {},
    fetchPolicy: 'cache-and-network',
    skip: !hasLogIn,
  });

  if (error) {
    return {
      state: 'error',
      error: error.message,
    };
  }

  // Instead of checking the loading var we check this. Apollo sets the loading
  // var to true even if we still have cached data that we can use. We  also need to
  // check if `data.me` isnt undefined before getting templates.
  if (typeof data?.me === 'undefined') {
    return {
      state: 'loading',
    };
  }

  const teamTemplates =
    isUser || !teamId ? getUserTemplates(data) : getTeamTemplates(data, teamId);

  return {
    state: 'ready',
    recentTemplates: data.me.recentlyUsedTemplates,
    teamTemplates,
  };
};
