import { Icon } from '@codesandbox/components';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
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
  const { restrictsPublicRepos } = useGitHuPermissions();

  if (!restrictsPublicRepos) {
    return null;
  }

  return (
    <StyledDisclaimerWrapper insideGrid={insideGrid}>
      <StyledDisclaimerText>
        Review your GitHub permissions to modify this repository.
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
