// Minimal scope asked when signing in
export const GH_BASE_SCOPE = 'user:email';

// Working scope that needs to be granted so users
// can commit and list their organizations when
// forking.
const GH_WORKING_SCOPES = ['workflow', 'read:org'].toString();

// Possible repo scopes, users that want to work
// in public repos only (eg: open source maintainers)
// don't need to grant access to their private repos
// if they don't want to.
const GH_REPO_SCOPE_OPTIONS = ['private_repos', 'public_repos'] as const;

export type GHScopeOption = typeof GH_REPO_SCOPE_OPTIONS[number];

export const MAP_GH_SCOPE_OPTIONS: Record<GHScopeOption, string> = {
  public_repos: GH_WORKING_SCOPES + ',public_repo',
  private_repos: GH_WORKING_SCOPES + ',repo',
};

export type AuthOptions =
  | {
      provider: 'github';
      includedScopes?: GHScopeOption;
    }
  | {
      provider: 'apple' | 'google';
    }
  | {
      provider: 'sso';
      ssoURL: string;
    };
