import { useQuery } from '@apollo/react-hooks';
import {
  GetGithubOrganizationsQuery,
  GetGithubOrganizationsQueryVariables,
  ProfileFragment,
  OrganizationFragment,
} from 'app/graphql/types';
import { GET_GITHUB_ORGANIZATIONS } from '../queries';

export type GithubOrganizationsState =
  | { state: 'loading' }
  | {
      state: 'ready';
      data: Array<ProfileFragment | OrganizationFragment>;
    }
  | {
      state: 'error';
      error: string;
    };
    
export const useOrganizationRepos = (): GithubOrganizationsState => {
  const { data, error } = useQuery<
    GetGithubOrganizationsQuery,
    GetGithubOrganizationsQueryVariables
  >(GET_GITHUB_ORGANIZATIONS, {});

  if (error) {
    return {
      state: 'error',
      error: error.message,
    };
  }

  if (typeof data?.me === 'undefined') {
    return {
      state: 'loading',
    };
  }

  return {
    state: 'ready',
    data: [data.me.githubProfile, ...data.me.githubOrganizations],
  };
};
