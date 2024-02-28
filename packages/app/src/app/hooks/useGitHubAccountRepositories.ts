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
};

export const useGitHubAccountRepositories = ({
  name,
  accountType,
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
      perPage: 1000, // TODO determine how much repos
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
      perPage: 1000, // TODO determine how much repos
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

  const accountData = account?.data?.me?.githubRepos;
  const organizationData = organization?.data?.githubOrganizationRepos.sort(
    (a, b) => (a.pushedAt > b.pushedAt ? -1 : 1) // Sort by last pushed
  );
  const isLoading = account.loading || organization.loading;

  if (
    (typeof accountData === 'undefined' &&
      typeof organizationData === 'undefined') ||
    isLoading
  ) {
    return {
      state: 'loading',
    };
  }

  return {
    state: 'ready',
    data: (accountData || organizationData)?.filter(
      repository => repository.owner.login === name
    ),
  };
};
