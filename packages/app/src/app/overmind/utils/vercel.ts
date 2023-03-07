import { CurrentUser, CurrentUserFromAPI } from '@codesandbox/common/lib/types';

// comment to trigger CI

export const renameZeitToVercel = (user: CurrentUserFromAPI): CurrentUser => {
  return {
    ...user,
    integrations: {
      github: user.integrations.github,
      vercel: user.integrations.zeit,
    },
  };
};
