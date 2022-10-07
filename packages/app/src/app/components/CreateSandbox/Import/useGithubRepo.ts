import { useQuery } from '@apollo/react-hooks';
import {
  GetGithubRepoQuery,
  GetGithubRepoQueryVariables,
} from 'app/graphql/types';
import { GET_GITHUB_REPO } from '../queries';
import { GithubRepoToImport } from './types';

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
    return {
      state: 'error',
      error: error.message,
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
