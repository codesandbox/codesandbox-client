export const GH_BASE_SCOPE = 'user:email';
const SCOPE_OPTIONS = ['private_repos', 'public_repos'] as const;

export type GHScopeOption = typeof SCOPE_OPTIONS[number];

export const MAP_GH_SCOPE_OPTIONS: Record<GHScopeOption, string> = {
  public_repos: 'public_repo,workflow',
  private_repos: 'repo,workflow',
};

export type AuthOptions =
  | {
      provider: 'github';
      includedScopes?: GHScopeOption;
    }
  | {
      provider: 'apple' | 'google';
    };
