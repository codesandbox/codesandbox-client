import { useQuery } from '@apollo/react-hooks';
import {
  GetGithubRepoQuery,
  GetGithubRepoQueryVariables,
} from 'app/graphql/types';
import { GET_GITHUB_REPO } from '../../queries';

type State =
  | { state: 'idle' }
  | { state: 'loading' }
  | {
      state: 'ready';
      data: NonNullable<GetGithubRepoQuery['githubRepo']>;
    }
  | {
      state: 'error';
      error: string;
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
  const { data, error } = useQuery<
    GetGithubRepoQuery,
    GetGithubRepoQueryVariables
  >(GET_GITHUB_REPO, {
    fetchPolicy: 'cache-and-network',
    variables: { owner, name },
    skip: !shouldFetch,
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
