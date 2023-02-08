import { useAppState } from 'app/overmind';

const NO_PERMISSIONS = {
  restrictsPublicRepos: true,
  restrictsPrivateRepos: true,
};

export const useGitHuPermissions = (): {
  restrictsPublicRepos: boolean;
  restrictsPrivateRepos: boolean;
} => {
  const { hasLogIn, user } = useAppState();

  if (!hasLogIn || !user) {
    return NO_PERMISSIONS;
  }

  const { data, error } = user.githubProfile;
  if (error || !data) {
    return NO_PERMISSIONS;
  }

  const scopes = data.scopes;

  return {
    restrictsPublicRepos: !(
      scopes.includes('repo') || scopes.includes('public_repo')
    ),
    restrictsPrivateRepos: !scopes.includes('repo'),
  };
};
