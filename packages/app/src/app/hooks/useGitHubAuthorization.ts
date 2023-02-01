import { useAppState } from 'app/overmind';

const NO_AUTH = {
  allowsPrivateRepos: false,
  allowsPublicRepos: false,
};

export const useGitHubAuthorization = (): {
  allowsPrivateRepos: boolean;
  allowsPublicRepos: boolean;
} => {
  const { hasLogIn, user } = useAppState();

  if (!hasLogIn || !user) {
    return NO_AUTH;
  }

  const { data, error } = user.githubProfile;
  if (error) {
    return NO_AUTH;
  }

  const scopes = data.scopes;

  return {
    allowsPrivateRepos: scopes.includes('repo'),
    allowsPublicRepos:
      scopes.includes('repo') || scopes.includes('public_repo'),
  };
};
