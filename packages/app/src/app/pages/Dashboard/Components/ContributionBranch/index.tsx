import { v2BranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import {
  Icon,
  ListAction,
  Stack,
  Text,
  Tooltip,
} from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import React from 'react';
import { css } from '@styled-system/css';
import { useHistory } from 'react-router-dom';
import { DashboardContributionBranch } from '../../types';

export const ContributionBranch: React.FC<DashboardContributionBranch> = ({
  branch,
}) => {
  const {
    dashboard: { viewMode },
  } = useAppState();
  const history = useHistory();
  const { name, project } = branch;
  const { repository } = project;

  const url = v2BranchUrl({ name, project });

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // TODO: add analytics
    if (e.metaKey) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
  };

  const ariaLabel = `Open branch ${name} from ${repository.name} by ${repository.owner} in the editor`;

  if (viewMode === 'grid') {
    return (
      <Stack
        aria-label={ariaLabel}
        css={css({
          cursor: 'pointer', // TODO: revisit cursor.
          position: 'relative',
          overflow: 'hidden',
          height: 240,
          width: '100%',
          borderRadius: '4px',
          background: '#191919',
          opacity: 0.8,
          transition: 'opacity ease-in-out',
          transitionDuration: theme => theme.speeds[4],
          ':hover, :focus, :focus-within': {
            // This is not the official transition.
            opacity: 1,
          },
          ':focus-visible': {
            boxShadow: '0 0 2px 1px rgba(255, 255, 255, 0.4)',
          },
        })}
        direction="vertical"
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick(e)}
        tabIndex={0}
        // TODO: refine semantics when/if the context menu gets implemented.
        role="link"
      >
        <Stack
          css={css({
            backgroundColor: 'rgba(229, 229, 229, 0.04)',
            paddingY: 10,
          })}
          align="center"
          justify="center"
        >
          <Icon aria-hidden color="#808080" name="fork" size={40} />
        </Stack>
        <Stack
          css={css({
            backgroundColor: 'grays.700',
            padding: 6,
          })}
          direction="vertical"
          gap={10}
        >
          {/** TODO: refine Tooltip, delay or wrap around the whole element? */}
          <Tooltip label={name}>
            <Text
              css={css({
                color: '#E5E5E5',
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              })}
              weight="medium"
              size={13}
            >
              {name}
            </Text>
          </Tooltip>
          <Stack gap={2}>
            <Icon color="#EDFFA5" name="contribution" size={16} />
            <Text
              css={css({
                color: '#808080',
              })}
              size={13}
            >
              {repository.owner}/{repository.name}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return <ListAction />;
};
