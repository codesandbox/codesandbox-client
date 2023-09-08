import { MessageStripe } from '@codesandbox/components';
import { useNewControlledWindow } from 'app/hooks/useNewControlledWindow';
import { githubAppInstallLink } from '@codesandbox/common/lib/utils/url-generator';
import React from 'react';

export const InstallGHAppStripe: React.FC<{
  onCloseWindow: () => void;
}> = ({ onCloseWindow }) => {
  const { openNewWindow } = useNewControlledWindow({
    url: githubAppInstallLink(),
    trackEvents: {
      open: 'gh_app_open_install_popup',
      close: 'gh_app_close_install_popup',
    },
    onCloseWindow,
  });

  return (
    <MessageStripe justify="space-between" variant="warning">
      The repository might not have the latest data from GitHub. Install our
      GitHub app to get the full experience.
      <MessageStripe.Action onClick={openNewWindow}>
        Install GitHub App
      </MessageStripe.Action>
    </MessageStripe>
  );
};
