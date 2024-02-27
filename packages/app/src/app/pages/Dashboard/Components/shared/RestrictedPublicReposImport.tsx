import { MessageStripe, ComboButton } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';

export const RestrictedPublicReposImport: React.FC<{
  onDismiss?: () => void;
}> = ({ onDismiss }) => {
  const { signInGithubClicked } = useActions();
  const { isLoadingGithub } = useAppState();

  React.useEffect(() => {
    track('Import Repo - Ask for public & private repo access');
  }, []);

  return (
    <MessageStripe
      justify="space-between"
      onDismiss={onDismiss}
      variant="warning"
    >
      Adjust your GitHub permissions to access your repositories.
      <ComboButton
        variant="dark"
        disabled={isLoadingGithub}
        onClick={() => signInGithubClicked('private_repos')}
        options={
          <>
            <ComboButton.Item
              onSelect={() => signInGithubClicked('private_repos')}
            >
              Authorize access to all repositories{' '}
            </ComboButton.Item>
            <ComboButton.Item
              onSelect={() => signInGithubClicked('public_repos')}
            >
              Authorize access only to public repositories{' '}
            </ComboButton.Item>
          </>
        }
      >
        Authorize access to all repositories{' '}
      </ComboButton>
    </MessageStripe>
  );
};
