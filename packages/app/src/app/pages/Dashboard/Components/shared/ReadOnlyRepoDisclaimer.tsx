import { Button, Element, Icon, Text } from '@codesandbox/components';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { useActions } from 'app/overmind';
import React from 'react';

export const ReadOnlyRepoDisclaimer: React.FC<{ insideGrid?: boolean }> = ({
  insideGrid = false,
}) => {
  const actions = useActions();
  const { restrictsPublicRepos } = useGitHuPermissions();

  if (!restrictsPublicRepos) {
    return null;
  }

  return (
    <Element
      css={{
        display: 'flex',
        flexDirection: insideGrid ? 'column' : 'row',
        alignItems: insideGrid ? 'flex-start' : 'center',
        gap: 0,
      }}
    >
      <Text
        css={{
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '16px',
          letterSpacing: '0.005em',
          color: '#999999',
        }}
      >
        Review your GitHub permissions to modify this repository.
      </Text>
      <Button
        css={{
          display: 'flex',
          gap: '8px',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '12px',
          lineHeight: '20px',
          letterSpacing: '-0.02em',
          color: '#EBEBEB',
          transition: 'color ease-in .3s',
          padding: `4px ${insideGrid ? 0 : '8px'}`,

          '&:hover:not(:disabled), &:focus:not(:disabled)': {
            color: '#E0E0E0',
          },

          '&:focus-visible': {
            outline: '#ac9cff solid 2px',
            outlineOffset: '-2px',
          },
        }}
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
      </Button>
    </Element>
  );
};
