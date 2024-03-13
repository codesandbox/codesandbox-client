import { useQuery } from '@apollo/react-hooks';
import {
  RepositoryTeamsQuery,
  RepositoryTeamsQueryVariables,
} from 'app/graphql/types';
import { GET_REPOSITORY_TEAMS } from '../utils/queries';

type ProjectTeam = {
  id: string;
  name: string;
};

export const useRepositoryWorkspaces = (
  owner: string,
  name: string
): ProjectTeam[] => {
  const { data, error, loading } = useQuery<
    RepositoryTeamsQuery,
    RepositoryTeamsQueryVariables
  >(GET_REPOSITORY_TEAMS, {
    variables: {
      owner,
      name,
    },
  });

  if (error || loading) {
    // Silent error
    return [];
  }

  return data.projects
    .filter(project => project.team !== null)
    .map(project => project.team);
};
