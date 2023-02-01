import { useAppState } from 'app/overmind';

export const useGitHubAuthorization = () => {
  const { hasLogIn, user } = useAppState();

  if (!hasLogIn || !user) {
    return null;
  }

  const { data, error } = user.githubProfile;
  if (error) {
    return null;
  }

  const scopes = data.scopes;

  return {
    allowsPrivateRepos: scopes.includes('repo'),
    allowsPublicRepos:
      scopes.includes('repo') || scopes.includes('public_repo'),
  };
};
