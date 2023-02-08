import { Button, Element, Icon, Text } from '@codesandbox/components';
import { useDismissible } from 'app/hooks';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { useActions } from 'app/overmind';
import React from 'react';

export const RestrictedImportDisclaimer: React.FC<{ insideGrid?: boolean }> = ({
  insideGrid = false,
}) => {
  const actions = useActions();
  const { restrictsPublicRepos, restrictsPrivateRepos } = useGitHuPermissions();
  const [dismissedPermissionsBanner] = useDismissible(
    'DASHBOARD_REPOSITORIES_PERMISSIONS_BANNER'
  );

  const dismissedBannerButRestrictsPublicRepos =
    dismissedPermissionsBanner && restrictsPublicRepos;
  const onlyAllowsPublicRepos = !restrictsPublicRepos && restrictsPrivateRepos;

  if (dismissedBannerButRestrictsPublicRepos || onlyAllowsPublicRepos) {
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
          Don&apos;t see all your repositories?
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
  }

  return null;
};
