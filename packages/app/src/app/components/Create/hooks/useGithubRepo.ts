import { useQuery } from '@apollo/react-hooks';
import {
  GetGithubRepoQuery,
  GetGithubRepoQueryVariables,
} from 'app/graphql/types';
import { GET_GITHUB_REPO } from '../utils/queries';
import { GithubRepoToImport } from '../utils/types';

type State =
  | { state: 'idle' }
  | { state: 'loading' }
  | {
      state: 'ready';
      data: GithubRepoToImport;
    }
  | {
      state: 'error';
      error: string;
      code?: string;
    };
export const useGithubRepo = ({
  owner,
  name,
  onCompleted,
  shouldFetch,
}: {
  owner?: string;
  name?: string;
  shouldFetch: boolean;
  onCompleted: (data: GithubRepoToImport) => void;
}): State => {
  const { data, error } = useQuery<
    GetGithubRepoQuery,
    GetGithubRepoQueryVariables
  >(GET_GITHUB_REPO, {
    fetchPolicy: 'cache-and-network',
    variables: { owner, name },
    skip: !shouldFetch,
    onCompleted: response => onCompleted(response.githubRepo),
  });

  if (!shouldFetch) {
    return {
      state: 'idle',
    };
  }

  if (error) {
    const _error = error.graphQLErrors[0];

    return {
      state: 'error',
      error: _error.message,
      code: (_error as any)?.code,
    };
  }

  if (typeof data?.githubRepo === 'undefined') {
    return {
      state: 'loading',
    };
  }

  return {
    state: 'ready',
    data: data.githubRepo,
  };
};
