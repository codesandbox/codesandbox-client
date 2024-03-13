import { useQuery } from '@apollo/react-hooks';
import {
  GetGithubAccountsQuery,
  GetGithubAccountsQueryVariables,
  ProfileFragment,
  OrganizationFragment,
} from 'app/graphql/types';
import { GET_GITHUB_ACCOUNTS } from '../components/Create/utils/queries';

export type GithubAccounts =
  | { state: 'error'; error: string }
  | { state: 'loading' }
  | {
      state: 'ready';
      personal: ProfileFragment;
      all: Array<OrganizationFragment | ProfileFragment>;
    };

export const useGithubAccounts = (skip?: boolean): GithubAccounts => {
  const { data, error, loading } = useQuery<
    GetGithubAccountsQuery,
    GetGithubAccountsQueryVariables
  >(GET_GITHUB_ACCOUNTS, { skip });

  if (error) {
    return {
      state: 'error',
      error: error.message,
    };
  }

  if (loading) {
    return {
      state: 'loading',
    };
  }

  const githubAccount = data?.me?.githubProfile ?? null;
  const githubOrgs = data?.me?.githubOrganizations ?? [];

  if (githubAccount === null) {
    return {
      state: 'error',
      error: 'No organizations found',
    };
  }

  return {
    state: 'ready',
    personal: githubAccount,
    all: [githubAccount, ...githubOrgs],
  };
};
