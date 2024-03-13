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
    };
export const useGithubRepo = ({
  owner,
  name,
  shouldFetch,
}: {
  owner?: string;
  name?: string;
  shouldFetch: boolean;
}): State => {
  const { data, error, loading } = useQuery<
    GetGithubRepoQuery,
    GetGithubRepoQueryVariables
  >(GET_GITHUB_REPO, {
    fetchPolicy: 'network-only',
    variables: { owner, name },
    skip: !shouldFetch,
  });

  if (!shouldFetch) {
    return {
      state: 'idle',
    };
  }

  if (loading) {
    return {
      state: 'loading',
    };
  }

  if (error || !data.githubRepo) {
    return {
      state: 'error',
    };
  }

  return {
    state: 'ready',
    data: data.githubRepo,
  };
};
