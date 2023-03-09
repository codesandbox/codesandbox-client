import { useQuery } from '@apollo/react-hooks';
import {
  GetGithubAccountsQuery,
  GetGithubAccountsQueryVariables,
  ProfileFragment,
  OrganizationFragment,
} from 'app/graphql/types';
import { GET_GITHUB_ACCOUNTS } from '../queries';

export const useGithubAccounts = (): {
  state: 'error' | 'loading' | 'ready';
  error?: string;
  data?: {
    personal?: ProfileFragment | null;
    organizations?: OrganizationFragment[] | null;
  };
} => {
  const { data, error } = useQuery<
    GetGithubAccountsQuery,
    GetGithubAccountsQueryVariables
  >(GET_GITHUB_ACCOUNTS);

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
    data: {
      personal: data.me?.githubProfile,
      organizations: data.me?.githubOrganizations,
    },
  };
};
