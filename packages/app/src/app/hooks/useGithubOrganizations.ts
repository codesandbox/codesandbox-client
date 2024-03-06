import { useQuery } from '@apollo/react-hooks';
import {
  GetGithubAccountsQuery,
  GetGithubAccountsQueryVariables,
  ProfileFragment,
  OrganizationFragment,
} from 'app/graphql/types';
import { GET_GITHUB_ACCOUNTS } from '../components/Create/utils/queries';

type GithubAccountsReturnType =
  | { state: 'error'; error: string }
  | { state: 'loading' }
  | {
      state: 'ready';
      personal: ProfileFragment;
      all: OrganizationFragment[];
      inferred?: OrganizationFragment;
    };

export const useGithubAccounts = (): GithubAccountsReturnType => {
  const { data, error, loading } = useQuery<
    GetGithubAccountsQuery,
    GetGithubAccountsQueryVariables
  >(GET_GITHUB_ACCOUNTS);

  if (loading) {
    return {
      state: 'loading',
    };
  }

  if (error || !data?.me) {
    return {
      state: 'error',
      error: error.message,
    };
  }

  // Convert PersonalOrg fragment to generic org
  const personalOrg: OrganizationFragment = {
    id: data.me.githubProfile.id,
    login: data.me.githubProfile.login,
  };

  return {
    state: 'ready',
    personal: data.me.githubProfile,
    all: [personalOrg, ...data.me.githubOrganizations],
  };
};
