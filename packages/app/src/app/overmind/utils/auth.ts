export type AuthOptions =
  | {
      provider: 'github';
      useExtraScopes?: true; // Omit the flag if there's no need for extra scopes.
    }
  | {
      provider: 'apple' | 'google';
    };
