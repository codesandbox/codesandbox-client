import { useQuery } from '@apollo/react-hooks';
import {
  GetGitHubAccountReposQuery,
  GetGitHubAccountReposQueryVariables,
  GetGitHubOrganizationReposQuery,
  GetGitHubOrganizationReposQueryVariables,
  UserRepoSort,
} from 'app/graphql/types';
import {
  GET_GITHUB_ACCOUNT_REPOS,
  GET_GITHUB_ORGANIZATION_REPOS,
} from '../components/Create/utils/queries';

// GitHub makes a distinction between personal and organization accounts
// both are accounts, so I'm calling them that.

type UseGitHubAccountRepositoriesOptions = {
  name?: string;
  accountType?: 'personal' | 'organization';
  limit?: number;
};

export const useGitHubAccountRepositories = ({
  name,
  accountType,
  limit,
}: UseGitHubAccountRepositoriesOptions) => {
  const skipLoadingPersonal = accountType === 'organization' || !name;
  const skipLoadingOrganization = accountType === 'personal' || !name;

  // Query the personal repositories unless the selected github account
  // is an organization
  const account = useQuery<
    GetGitHubAccountReposQuery,
    GetGitHubAccountReposQueryVariables
  >(GET_GITHUB_ACCOUNT_REPOS, {
    skip: skipLoadingPersonal,
    variables: {
      perPage: limit ?? 100,
      page: 1,
      sort: UserRepoSort.Pushed,
    },
  });

  // Query the organization repositories unless the selected github account
  // is personal.
  const organization = useQuery<
    GetGitHubOrganizationReposQuery,
    GetGitHubOrganizationReposQueryVariables
  >(GET_GITHUB_ORGANIZATION_REPOS, {
    skip: skipLoadingOrganization,
    variables: {
      // The name can be null, but if it is we skip. Typescript doesn't know this and expects a string, so we
      // satisfy TypeScript by defaulting to an empty string.
      organization: name || '',
      perPage: limit ?? 100,
      page: 1,
    },
  });

  const error = account.error || organization.error;

  if (error) {
    return {
      state: 'error',
      error: error.message,
    };
  }

  if (
    (accountType === 'personal' && account.loading) ||
    (accountType === 'organization' && organization.loading)
  ) {
    return {
      state: 'loading',
    };
  }

  if (accountType === 'personal') {
    return {
      state: 'ready',
      data: account.data.me.githubRepos,
    };
  }

  if (accountType === 'organization') {
    return {
      state: 'ready',
      data: organization.data.githubOrganizationRepos.sort(
        (a, b) => (a.pushedAt && b.pushedAt && a.pushedAt > b.pushedAt ? -1 : 1) // Sort by last pushed
      ),
    };
  }

  return {
    state: 'error',
    error: 'No repositories available',
  };
};
