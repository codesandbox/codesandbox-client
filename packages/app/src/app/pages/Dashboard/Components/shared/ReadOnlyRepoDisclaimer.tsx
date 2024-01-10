import { Icon } from '@codesandbox/components';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
import { useActions } from 'app/overmind';
import React from 'react';
import {
  StyledDisclaimerButton,
  StyledDisclaimerText,
  StyledDisclaimerWrapper,
} from './elements';

export const ReadOnlyRepoDisclaimer: React.FC<{ insideGrid?: boolean }> = ({
  insideGrid = false,
}) => {
  const actions = useActions();
  const { restrictsPublicRepos } = useGitHubPermissions();

  if (!restrictsPublicRepos) {
    return null;
  }

  return (
    <StyledDisclaimerWrapper insideGrid={insideGrid}>
      <StyledDisclaimerText>
        To make changes, you&apos;ll need to grant access to CodeSandbox.
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
};
