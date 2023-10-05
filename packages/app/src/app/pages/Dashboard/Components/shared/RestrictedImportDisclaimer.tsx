import { Icon } from '@codesandbox/components';
import { useDismissible } from 'app/hooks';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
import { useActions } from 'app/overmind';
import React from 'react';
import {
  StyledDisclaimerButton,
  StyledDisclaimerText,
  StyledDisclaimerWrapper,
} from './elements';

export const RestrictedImportDisclaimer: React.FC<{ insideGrid?: boolean }> = ({
  insideGrid = false,
}) => {
  const actions = useActions();
  const {
    restrictsPublicRepos,
    restrictsPrivateRepos,
  } = useGitHubPermissions();
  const [dismissedPermissionsBanner] = useDismissible(
    'DASHBOARD_REPOSITORIES_PERMISSIONS_BANNER'
  );

  const dismissedBannerButRestrictsPublicRepos =
    dismissedPermissionsBanner && restrictsPublicRepos;
  const onlyAllowsPublicRepos =
    restrictsPublicRepos === false && restrictsPrivateRepos === true;

  if (dismissedBannerButRestrictsPublicRepos || onlyAllowsPublicRepos) {
    return (
      <StyledDisclaimerWrapper insideGrid={insideGrid}>
        <StyledDisclaimerText>
          Don&apos;t see all of your imported repositories?
        </StyledDisclaimerText>
        <StyledDisclaimerButton
          insideGrid={insideGrid}
          onClick={() =>
            actions.modalOpened({
              modal: 'preferences',
              itemId: 'integrations',
            })
          }
          variant="link"
          autoWidth
        >
          Review your GitHub permissions
          <Icon name="external" size={12} />
        </StyledDisclaimerButton>
      </StyledDisclaimerWrapper>
    );
  }

  return null;
};
