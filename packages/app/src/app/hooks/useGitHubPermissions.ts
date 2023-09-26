import { useAppState } from 'app/overmind';

const NO_PERMISSIONS = {
  restrictsPublicRepos: true,
  restrictsPrivateRepos: true,
  profile: null,
};

export const useGitHuPermissions = (): {
  restrictsPublicRepos: boolean;
  restrictsPrivateRepos: boolean;
  profile: { email: string; scopes: string[] } | null;
} => {
  const { hasLogIn, user } = useAppState();

  if (!hasLogIn || !user) {
    return NO_PERMISSIONS;
  }

  const {
    githubProfile: { data, error },
    integrations,
  } = user;

  if (error || !data || !integrations.github) {
    return NO_PERMISSIONS;
  }

  const scopes = data.scopes;

  return {
    restrictsPublicRepos: !(
      scopes.includes('repo') || scopes.includes('public_repo')
    ),
    restrictsPrivateRepos: !scopes.includes('repo'),
    profile: {
      email: integrations.github.email,
      scopes,
    },
  };
};
