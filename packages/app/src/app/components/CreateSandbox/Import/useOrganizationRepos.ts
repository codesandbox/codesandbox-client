import { useQuery } from '@apollo/react-hooks';
import {
  GetGitHubOrganizationReposQuery,
  GetGitHubOrganizationReposQueryVariables,
} from 'app/graphql/types';
import { GET_GITHUB_ORGANIZATION_REPOS } from '../queries';

/**
 * The organization property can be undefined because the organization
 * might still be loading. We can make the organization required when we
 * use this hook in a component that's conditionally rendered if the
 * organization is defined.
 */
type UseOrganizationReposOptions = {
  organization?: string;
};

export const useOrganizationRepos = ({
  organization,
}: UseOrganizationReposOptions) => {
  const { data, error } = useQuery<
    GetGitHubOrganizationReposQuery,
    GetGitHubOrganizationReposQueryVariables
  >(GET_GITHUB_ORGANIZATION_REPOS, {
    skip: !organization,
    variables: {
      organization,
      perPage: 10, // TODO determine how much repos
      page: 1,
    },
  });

  if (error) {
    return {
      state: 'error',
      error: error.message,
    };
  }

  if (typeof data?.githubOrganizationRepos === 'undefined') {
    return {
      state: 'loading',
    };
  }

  return {
    state: 'ready',
    data: data.githubOrganizationRepos,
  };
};
